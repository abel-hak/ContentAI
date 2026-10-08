from groq import AsyncGroq
from config import get_settings

settings = get_settings()

client = AsyncGroq(api_key=settings.groq_api_key)


async def _chat(prompt: str) -> str:
    response = await client.chat.completions.create(
        model=settings.groq_model,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=4096,
    )
    return response.choices[0].message.content or ""


async def generate_blog_outline(topic: str, tone: str, length: str) -> str:
    length_map = {
        "short": "3-5 main sections with 1-2 sub-points each",
        "medium": "5-7 main sections with 2-3 sub-points each",
        "long": "8-10 main sections with 3-4 sub-points each",
    }
    length_desc = length_map.get(length, length_map["medium"])

    prompt = f"""You are a professional content strategist. Generate a detailed blog post outline.

Topic: {topic}
Tone: {tone}
Structure: {length_desc}

Requirements:
- Start with a compelling title
- Include an engaging introduction section
- Create clear, hierarchical sections with Roman numerals (I, II, III...)
- Each section should have descriptive sub-points using letters (a, b, c...)
- Include a conclusion section with a call-to-action
- Add SEO keyword suggestions at the end
- The tone should be consistently {tone} throughout

Format the outline cleanly with proper indentation and hierarchy."""

    return await _chat(prompt)


async def rewrite_email(draft_email: str, tone: str) -> str:
    prompt = f"""You are an expert email communication specialist. Rewrite the following email draft with a {tone} tone.

Original Email:
---
{draft_email}
---

Requirements:
- Maintain the core message and intent of the original email
- Apply a {tone} tone consistently throughout
- Improve clarity and readability
- Use appropriate greeting and sign-off for the {tone} tone
- Fix any grammar or spelling issues
- Keep the email concise but complete
- Do NOT add explanations or commentary — just output the rewritten email

Output only the rewritten email, nothing else."""

    return await _chat(prompt)


async def generate_social_post(topic: str, platform: str, tone: str) -> str:
    platform_guidelines = {
        "twitter": "Max 280 characters per tweet. Use hashtags sparingly (2-3). Punchy and concise.",
        "linkedin": "Professional context. Can be longer (up to 3000 chars). Use line breaks for readability. Include relevant hashtags (3-5).",
        "instagram": "Visual-first. Engaging caption with emojis. Include 10-15 relevant hashtags at the end. Use line breaks.",
        "facebook": "Conversational. Medium length. Can include a question to drive engagement. 1-3 hashtags.",
        "threads": "Conversational and authentic. Can be up to 500 characters. Minimal hashtags (0-2).",
    }
    guidelines = platform_guidelines.get(platform, platform_guidelines["twitter"])

    prompt = f"""You are a social media content expert. Generate 3 unique post ideas for the given platform.

Topic: {topic}
Platform: {platform}
Tone: {tone}
Platform Guidelines: {guidelines}

Requirements:
- Generate exactly 3 different post variations
- Label them as Post 1, Post 2, Post 3
- Each post should take a slightly different angle on the topic
- Follow platform-specific best practices and character limits
- Apply the {tone} tone consistently
- Include relevant hashtags appropriate for the platform
- Make posts engaging and shareable
- Add an emoji or two where appropriate for the platform

Format each post clearly with a separator between them."""

    return await _chat(prompt)
