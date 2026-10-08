import logging

from fastapi import APIRouter, HTTPException

from models.schemas import (
    BlogOutlineRequest,
    BlogOutlineResponse,
    EmailRewriteRequest,
    EmailRewriteResponse,
    SocialPostRequest,
    SocialPostResponse,
)
from services.llm_service import (
    generate_blog_outline,
    rewrite_email,
    generate_social_post,
)

logger = logging.getLogger(__name__)

router = APIRouter()


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
