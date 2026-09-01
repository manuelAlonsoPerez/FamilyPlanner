from datetime import UTC, datetime, timedelta

import pytest
from pydantic import ValidationError

from family_planner_agent.contracts import (
    AgentResult,
    CalendarEvent,
    CalendarOperation,
    Proposal,
)


def event() -> CalendarEvent:
    starts_at = datetime(2026, 9, 4, 18, 0, tzinfo=UTC)
    return CalendarEvent(
        title="Family dinner",
        starts_at=starts_at,
        ends_at=starts_at + timedelta(hours=1),
        timezone="Europe/Oslo",
    )


def test_create_proposal_requires_after_event_only() -> None:
    proposal = Proposal(
        operation=CalendarOperation.CREATE,
        after=event(),
        summary="Create Friday's family dinner.",
    )

    result = AgentResult.model_validate({"result": proposal.model_dump(mode="json")})

    assert result.result.kind == "proposal"
    assert result.result.operation is CalendarOperation.CREATE


def test_update_proposal_requires_current_and_replacement_events() -> None:
    with pytest.raises(ValidationError, match="UPDATE requires"):
        Proposal(
            operation=CalendarOperation.UPDATE,
            target_event_id="event-123",
            after=event(),
            summary="Move dinner.",
        )


def test_event_rejects_naive_timestamps() -> None:
    with pytest.raises(ValidationError, match="UTC offset"):
        CalendarEvent(
            title="Family dinner",
            starts_at=datetime(2026, 9, 4, 18, 0),
            ends_at=datetime(2026, 9, 4, 19, 0),
            timezone="Europe/Oslo",
        )
