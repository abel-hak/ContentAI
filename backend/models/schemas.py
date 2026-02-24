from pydantic import BaseModel, Field
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


# --- Blog Outline ---

class BlogOutlineRequest(BaseModel):
    topic: str = Field(..., min_length=3, max_length=500, description="Blog topic")
    tone: Tone = Field(default=Tone.professional, description="Writing tone")
    length: BlogLength = Field(default=BlogLength.medium, description="Outline length")


class BlogOutlineResponse(BaseModel):
    outline: str
    topic: str
    tone: str
    length: str


# --- Email Rewriter ---

class EmailRewriteRequest(BaseModel):
    draft_email: str = Field(..., min_length=10, max_length=5000, description="Draft email to rewrite")
    tone: Tone = Field(default=Tone.professional, description="Desired tone")


class EmailRewriteResponse(BaseModel):
    rewritten_email: str
    original_tone: str
    applied_tone: str


# --- Social Post ---

class SocialPostRequest(BaseModel):
    topic: str = Field(..., min_length=3, max_length=500, description="Post topic")
    platform: Platform = Field(default=Platform.twitter, description="Target platform")
    tone: Tone = Field(default=Tone.casual, description="Writing tone")


class SocialPostResponse(BaseModel):
    posts: str
    topic: str
    platform: str
    tone: str


# --- Generic Error ---

class ErrorResponse(BaseModel):
    detail: str
