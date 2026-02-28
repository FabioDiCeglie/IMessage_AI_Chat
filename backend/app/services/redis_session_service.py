import json
import uuid

import redis


class RedisSessionService:
    def __init__(self, host: str = "redis", port: int = 6379, ttl: int = 86400):
        # ttl in seconds; 86400 = 24 hours — sessions expire after 24h of no use
        self._client = redis.Redis(host=host, port=port, decode_responses=True)
        self._ttl = ttl

    def _key(self, session_id: str) -> str:
        return f"session:{session_id}"

    def create_session(self) -> str:
        session_id = str(uuid.uuid4())
        self._client.setex(self._key(session_id), self._ttl, json.dumps([]))
        return session_id

    def get_messages(self, session_id: str) -> list[dict]:
        data = self._client.get(self._key(session_id))
        if data is None:
            return []
        return json.loads(data)

    def add_message(self, session_id: str, role: str, content: str):
        messages = self.get_messages(session_id)
        messages.append({"role": role, "content": content})
        self._client.setex(self._key(session_id), self._ttl, json.dumps(messages))

