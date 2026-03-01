#!/usr/bin/env python3
"""E2E tests against the chat API (backend on localhost:8000)."""
import sys
import requests

BASE = "http://localhost:8000/api/v1"


def test_health():
    r = requests.get(f"{BASE}/health")
    assert r.status_code == 204, f"health: expected 204, got {r.status_code}"
    print("  GET /health → 204")


def test_chat_and_session():
    # POST /chat without session_id -> new session
    r = requests.post(
        f"{BASE}/chat",
        json={
            "session_id": None,
            "message": {"role": "user", "content": "Say hello in one word."},
            "enable_thinking": False,
            "temperature": 0.1,
        },
    )
    assert r.status_code == 200, f"chat: expected 200, got {r.status_code} {r.text}"
    data = r.json()
    assert "content" in data, "chat: missing content"
    assert "session_id" in data, "chat: missing session_id"
    session_id = data["session_id"]

    # GET /sessions/{id}/messages -> history includes our exchange
    r = requests.get(f"{BASE}/sessions/{session_id}/messages")
    assert r.status_code == 200, f"messages: expected 200, got {r.status_code} {r.text}"
    data = r.json()
    assert "messages" in data, "messages: missing messages"
    msgs = data["messages"]
    assert len(msgs) >= 2, f"messages: expected at least 2, got {len(msgs)}"
    assert msgs[0]["role"] == "user"
    assert msgs[1]["role"] == "assistant"
    print("  POST /chat + GET /sessions/.../messages → 200")


def main():
    print(f"E2E tests → {BASE}")
    try:
        test_health()
        test_chat_and_session()
        print("E2E tests passed.")
    except AssertionError as e:
        print(f"E2E failed: {e}", file=sys.stderr)
        sys.exit(1)
    except requests.RequestException as e:
        print(f"E2E request error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
