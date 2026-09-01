from botocore.config import Config as BotocoreConfig
from strands import Agent
from strands.models import BedrockModel, Model
from strands.types.agent import Limits

from .config import Settings
from .contracts import AgentInvocationRequest, AgentInvocationResponse, AgentResult
from .prompts import SCHEDULING_SYSTEM_PROMPT, build_scheduling_prompt


def create_agent(settings: Settings, *, model: Model | None = None) -> Agent:
    resolved_model = model or BedrockModel(
        model_id=settings.bedrock_model_id,
        region_name=settings.aws_region,
        max_tokens=settings.agent_max_output_tokens,
        temperature=0,
        boto_client_config=BotocoreConfig(
            connect_timeout=5,
            read_timeout=settings.agent_request_timeout_seconds,
            retries={"max_attempts": 2, "mode": "standard"},
        ),
    )

    return Agent(
        name="family-planner-scheduling-agent",
        description="Produces structured calendar proposals from group conversations.",
        model=resolved_model,
        tools=[],
        system_prompt=SCHEDULING_SYSTEM_PROMPT,
        structured_output_model=AgentResult,
        callback_handler=None,
        trace_attributes={"app.environment": settings.app_env},
    )


def invoke_scheduling_agent(
    request: AgentInvocationRequest,
    settings: Settings,
    *,
    agent: Agent | None = None,
) -> AgentInvocationResponse:
    scheduling_agent = agent or create_agent(settings)
    prompt = build_scheduling_prompt(
        request,
        message_limit=settings.agent_context_message_limit,
    )
    limits: Limits = {
        "turns": settings.agent_max_steps,
        "output_tokens": settings.agent_max_output_tokens,
    }
    strands_result = scheduling_agent(prompt, limits=limits)

    if not isinstance(strands_result.structured_output, AgentResult):
        raise RuntimeError("agent did not return a valid structured result")

    return AgentInvocationResponse(
        request_id=request.request_id,
        result=strands_result.structured_output.result,
    )
