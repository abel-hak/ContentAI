import json
import logging
from collections.abc import AsyncIterator

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from models.schemas import (
    BlogOutlineRequest,
    BlogOutlineResponse,
    CompareRequest,
    CompareResponse,
    CompareVariant,
    EmailRewriteRequest,
    EmailRewriteResponse,
    SocialPostRequest,
    SocialPostResponse,
    ToolType,
)
from services.llm_service import (
    compare_blog_outlines,
    compare_email_rewrites,
    compare_social_posts,
    generate_blog_outline,
    generate_social_post,
    rewrite_email,
    stream_blog_outline,
    stream_email_rewrite,
    stream_social_post,
)

logger = logging.getLogger(__name__)
router = APIRouter()


def _sse(data: dict) -> str:
    return f"data: {json.dumps(data, ensure_ascii=False)}\n\n"


async def _stream_sse(token_stream: AsyncIterator[str]) -> AsyncIterator[str]:
    try:
        async for token in token_stream:
            yield _sse({"type": "token", "content": token})
        yield _sse({"type": "done"})
    except Exception as exc:
        logger.exception("Streaming generation failed")
        yield _sse({"type": "error", "detail": str(exc)})


@router.post("/blog-outline", response_model=BlogOutlineResponse)
async def create_blog_outline(request: BlogOutlineRequest):
    try:
        outline = await generate_blog_outline(
            topic=request.topic,
            tone=request.tone.value,
            length=request.length.value,
        )
        return BlogOutlineResponse(
            outline=outline,
            topic=request.topic,
            tone=request.tone.value,
            length=request.length.value,
        )
    except Exception as e:
        logger.exception("Blog outline generation failed")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/blog-outline/stream")
async def stream_blog_outline_endpoint(request: BlogOutlineRequest):
    return StreamingResponse(
        _stream_sse(
            stream_blog_outline(request.topic, request.tone.value, request.length.value)
        ),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@router.post("/email-rewrite", response_model=EmailRewriteResponse)
async def create_email_rewrite(request: EmailRewriteRequest):
    try:
        rewritten = await rewrite_email(
            draft_email=request.draft_email,
            tone=request.tone.value,
        )
        return EmailRewriteResponse(
            rewritten_email=rewritten,
            original_tone="original",
            applied_tone=request.tone.value,
        )
    except Exception as e:
        logger.exception("Email rewrite failed")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/email-rewrite/stream")
async def stream_email_rewrite_endpoint(request: EmailRewriteRequest):
    return StreamingResponse(
        _stream_sse(stream_email_rewrite(request.draft_email, request.tone.value)),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@router.post("/social-post", response_model=SocialPostResponse)
async def create_social_post(request: SocialPostRequest):
    try:
        posts = await generate_social_post(
            topic=request.topic,
            platform=request.platform.value,
            tone=request.tone.value,
        )
        return SocialPostResponse(
            posts=posts,
            topic=request.topic,
            platform=request.platform.value,
            tone=request.tone.value,
        )
    except Exception as e:
        logger.exception("Social post generation failed")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/social-post/stream")
async def stream_social_post_endpoint(request: SocialPostRequest):
    return StreamingResponse(
        _stream_sse(
            stream_social_post(request.topic, request.platform.value, request.tone.value)
        ),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@router.post("/compare", response_model=CompareResponse)
async def compare_tones(request: CompareRequest):
    try:
        tones = [tone.value for tone in request.tones]

        if request.tool == ToolType.blog_outline:
            if not request.topic or len(request.topic.strip()) < 3:
                raise HTTPException(status_code=422, detail="topic is required for blog compare")
            variants = await compare_blog_outlines(
                request.topic.strip(),
                request.length.value,
                tones,
            )
        elif request.tool == ToolType.email_rewrite:
            if not request.draft_email or len(request.draft_email.strip()) < 10:
                raise HTTPException(status_code=422, detail="draft_email is required for email compare")
            variants = await compare_email_rewrites(request.draft_email.strip(), tones)
        else:
            if not request.topic or len(request.topic.strip()) < 3:
                raise HTTPException(status_code=422, detail="topic is required for social compare")
            variants = await compare_social_posts(
                request.topic.strip(),
                request.platform.value,
                tones,
            )

        return CompareResponse(
            tool=request.tool.value,
            variants=[CompareVariant(**item) for item in variants],
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Tone comparison failed")
        raise HTTPException(status_code=500, detail=str(e))
