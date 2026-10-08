from unittest.mock import AsyncMock, patch

from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["app"] == "ContentAI"
    assert "groq_configured" in data
    assert "model" in data


def test_blog_outline_validation_rejects_short_topic():
    response = client.post(
        "/api/generate/blog-outline",
        json={"topic": "ai", "tone": "professional", "length": "medium"},
    )
    assert response.status_code == 422


@patch("routers.generate.generate_blog_outline", new_callable=AsyncMock)
def test_blog_outline_success(mock_generate):
    mock_generate.return_value = "# Sample Outline\n\nI. Introduction"

    response = client.post(
        "/api/generate/blog-outline",
        json={"topic": "AI in Healthcare", "tone": "professional", "length": "medium"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["topic"] == "AI in Healthcare"
    assert data["tone"] == "professional"
    assert data["length"] == "medium"
    assert "Sample Outline" in data["outline"]
    mock_generate.assert_awaited_once()


@patch("routers.generate.rewrite_email", new_callable=AsyncMock)
def test_email_rewrite_success(mock_rewrite):
    mock_rewrite.return_value = "Hello team,\n\nPlease review the attached report."

    response = client.post(
        "/api/generate/email-rewrite",
        json={
            "draft_email": "hey can you check this report when you get a chance thanks",
            "tone": "professional",
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert data["applied_tone"] == "professional"
    assert "Hello team" in data["rewritten_email"]
    mock_rewrite.assert_awaited_once()


@patch("routers.generate.generate_social_post", new_callable=AsyncMock)
def test_social_post_success(mock_generate):
    mock_generate.return_value = "Post 1\n---\nPost 2\n---\nPost 3"

    response = client.post(
        "/api/generate/social-post",
        json={"topic": "Product launch", "platform": "linkedin", "tone": "persuasive"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["platform"] == "linkedin"
    assert data["tone"] == "persuasive"
    assert "Post 1" in data["posts"]
    mock_generate.assert_awaited_once()


@patch("routers.generate.generate_blog_outline", new_callable=AsyncMock)
def test_blog_outline_handles_service_error(mock_generate):
    mock_generate.side_effect = Exception("Rate limit exceeded")

    response = client.post(
        "/api/generate/blog-outline",
        json={"topic": "AI in Healthcare", "tone": "casual", "length": "short"},
    )

    assert response.status_code == 500
    assert "Rate limit exceeded" in response.json()["detail"]


@patch("routers.generate.compare_blog_outlines", new_callable=AsyncMock)
def test_compare_blog_outlines(mock_compare):
    mock_compare.return_value = [
        {"tone": "professional", "content": "Outline A"},
        {"tone": "casual", "content": "Outline B"},
        {"tone": "witty", "content": "Outline C"},
    ]

    response = client.post(
        "/api/generate/compare",
        json={
            "tool": "blog-outline",
            "tones": ["professional", "casual", "witty"],
            "topic": "AI in Healthcare",
            "length": "short",
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert data["tool"] == "blog-outline"
    assert len(data["variants"]) == 3
    assert data["variants"][0]["tone"] == "professional"
    mock_compare.assert_awaited_once()
