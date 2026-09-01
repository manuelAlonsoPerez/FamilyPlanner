from datetime import datetime
from typing import Literal

from pydantic import Field

from .proposal import AgentDecision, ContractModel


class MessageContext(ContractModel):
    message_id: str = Field(min_length=1, max_length=200)
    sender_id: str = Field(min_length=1, max_length=200)
    sender_display_name: str = Field(min_length=1, max_length=200)
    body: str = Field(min_length=1, max_length=4_000)
    sent_at: datetime


class AgentInvocationRequest(ContractModel):
    contract_version: Literal["1.0"] = "1.0"
    request_id: str = Field(min_length=1, max_length=200)
    group_id: str = Field(min_length=1, max_length=200)
    actor_id: str = Field(min_length=1, max_length=200)
    session_id: str = Field(min_length=1, max_length=200)
    timezone: str = Field(min_length=1, max_length=100)
    messages: list[MessageContext] = Field(min_length=1, max_length=20)


class AgentInvocationResponse(ContractModel):
    contract_version: Literal["1.0"] = "1.0"
    request_id: str
    result: AgentDecision
