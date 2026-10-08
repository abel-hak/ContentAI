from pydantic import BaseModel, Field, field_validator
from enum import Enum


class Tone(str, Enum):
    formal = "formal"
    casual = "casual"
    persuasive = "persuasive"
    professional = "professional"
    friendly = "friendly"
    witty = "witty"


class Platform(str, Enum):
    twitter = "twitter"
    linkedin = "linkedin"
    instagram = "instagram"
    facebook = "facebook"
    threads = "threads"


class BlogLength(str, Enum):
    short = "short"
    medium = "medium"
    long = "long"


class ToolType(str, Enum):
    blog_outline = "blog-outline"
    email_rewrite = "email-rewrite"
    social_post = "social-post"


class BlogOutlineRequest(BaseModel):
    topic: str = Field(..., min_length=3, max_length=500)
    tone: Tone = Field(default=Tone.professional)
    length: BlogLength = Field(default=BlogLength.medium)


class BlogOutlineResponse(BaseModel):
    outline: str
    topic: str
    tone: str
    length: str


class EmailRewriteRequest(BaseModel):
    draft_email: str = Field(..., min_length=10, max_length=5000)
    tone: Tone = Field(default=Tone.professional)


class EmailRewriteResponse(BaseModel):
    rewritten_email: str
    original_tone: str
    applied_tone: str


class SocialPostRequest(BaseModel):
    topic: str = Field(..., min_length=3, max_length=500)
    platform: Platform = Field(default=Platform.twitter)
    tone: Tone = Field(default=Tone.casual)


class SocialPostResponse(BaseModel):
    posts: str
    topic: str
    platform: str
    tone: str


class CompareRequest(BaseModel):
    tool: ToolType
    tones: list[Tone] = Field(..., min_length=2, max_length=3)
    topic: str | None = None
    length: BlogLength = BlogLength.medium
    draft_email: str | None = None
    platform: Platform = Platform.twitter

    @field_validator("tones")
    @classmethod
    def unique_tones(cls, value: list[Tone]) -> list[Tone]:
        if len(set(value)) != len(value):
            raise ValueError("tones must be unique")
        return value


class CompareVariant(BaseModel):
    tone: str
    content: str


class CompareResponse(BaseModel):
    tool: str
    variants: list[CompareVariant]


class ErrorResponse(BaseModel):
    detail: str
