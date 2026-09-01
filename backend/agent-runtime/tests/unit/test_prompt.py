from datetime import UTC, datetime, timedelta

from family_planner_agent.contracts import AgentInvocationRequest, MessageContext
from family_planner_agent.prompts import build_scheduling_prompt


def test_prompt_contains_only_bounded_recent_messages() -> None:
    sent_at = datetime(2026, 9, 1, 8, 0, tzinfo=UTC)
    messages = [
        MessageContext(
            message_id=f"message-{index}",
            sender_id="member-1",
            sender_display_name="Maya",
            body=f"Message body {index}",
            sent_at=sent_at + timedelta(minutes=index),
        )
        for index in range(3)
    ]
    request = AgentInvocationRequest(
        request_id="request-1",
        group_id="group-1",
        actor_id="member-1",
        session_id="session-1",
        timezone="Europe/Oslo",
        messages=messages,
    )

    prompt = build_scheduling_prompt(request, message_limit=2)

    assert "<scheduling_context>" in prompt
    assert "Message body 0" not in prompt
    assert "Message body 1" in prompt
    assert "Message body 2" in prompt
