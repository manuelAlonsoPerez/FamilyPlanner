from __future__ import annotations

from datetime import datetime
from enum import StrEnum
from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator


class ContractModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class CalendarOperation(StrEnum):
    CREATE = "CREATE"
    UPDATE = "UPDATE"
    DELETE = "DELETE"


class CalendarEvent(ContractModel):
    title: str = Field(min_length=1, max_length=200)
    starts_at: datetime
    ends_at: datetime
    timezone: str = Field(min_length=1, max_length=100)
    location: str | None = Field(default=None, max_length=500)
    description: str | None = Field(default=None, max_length=2_000)

    @model_validator(mode="after")
    def validate_time_range(self) -> CalendarEvent:
        if self.starts_at.tzinfo is None or self.ends_at.tzinfo is None:
            raise ValueError("event timestamps must include a UTC offset")
        if self.ends_at <= self.starts_at:
            raise ValueError("ends_at must be later than starts_at")
        return self


class NoAction(ContractModel):
    kind: Literal["no_action"] = "no_action"
    reason: str = Field(min_length=1, max_length=1_000)


class Clarification(ContractModel):
    kind: Literal["clarification"] = "clarification"
    question: str = Field(min_length=1, max_length=1_000)
    missing_fields: list[str] = Field(min_length=1, max_length=10)


class Refusal(ContractModel):
    kind: Literal["refusal"] = "refusal"
    reason: str = Field(min_length=1, max_length=1_000)


class Proposal(ContractModel):
    kind: Literal["proposal"] = "proposal"
    operation: CalendarOperation
    target_event_id: str | None = Field(default=None, max_length=200)
    before: CalendarEvent | None = None
    after: CalendarEvent | None = None
    affected_member_ids: list[str] = Field(default_factory=list, max_length=100)
    summary: str = Field(min_length=1, max_length=1_000)

    @model_validator(mode="after")
    def validate_operation_shape(self) -> Proposal:
        if self.operation is CalendarOperation.CREATE:
            if self.target_event_id is not None or self.before is not None or self.after is None:
                raise ValueError("CREATE requires only an after event")
        elif self.operation is CalendarOperation.UPDATE:
            if self.target_event_id is None or self.before is None or self.after is None:
                raise ValueError("UPDATE requires a target event, before event, and after event")
        elif self.target_event_id is None or self.before is None or self.after is not None:
            raise ValueError("DELETE requires a target event and before event")
        return self


AgentDecision = Annotated[
    NoAction | Clarification | Proposal | Refusal,
    Field(discriminator="kind"),
]


class AgentResult(ContractModel):
    result: AgentDecision
