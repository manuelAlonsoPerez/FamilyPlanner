from datetime import UTC, datetime
from types import SimpleNamespace
from unittest.mock import MagicMock

from family_planner_agent.agent import invoke_scheduling_agent
from family_planner_agent.config import Settings
from family_planner_agent.contracts import (
    AgentInvocationRequest,
    AgentResult,
    MessageContext,
    NoAction,
)


def test_invocation_uses_structured_output_without_bedrock_call() -> None:
    request = AgentInvocationRequest(
        request_id="request-1",
        group_id="group-1",
        actor_id="member-1",
        session_id="session-1",
        timezone="Europe/Oslo",
        messages=[
            MessageContext(
                message_id="message-1",
                sender_id="member-1",
                sender_display_name="Maya",
                body="Thanks everyone.",
                sent_at=datetime(2026, 9, 1, 8, 0, tzinfo=UTC),
            )
        ],
    )
    fake_agent = MagicMock()
    fake_agent.return_value = SimpleNamespace(
        structured_output=AgentResult(result=NoAction(reason="No scheduling request was made."))
    )

    response = invoke_scheduling_agent(
        request,
        Settings(_env_file=None),
        agent=fake_agent,
    )

    assert response.request_id == request.request_id
    assert response.result.kind == "no_action"
    fake_agent.assert_called_once()
    assert fake_agent.call_args.kwargs["limits"] == {
        "turns": 6,
        "output_tokens": 1_024,
    }
