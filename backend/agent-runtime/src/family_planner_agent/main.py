from typing import Any

import structlog
from bedrock_agentcore import BedrockAgentCoreApp

from .agent import invoke_scheduling_agent
from .config import Settings
from .contracts import AgentInvocationRequest
from .logging import configure_logging

settings = Settings()
configure_logging(settings.log_level)
logger = structlog.get_logger()
app = BedrockAgentCoreApp(debug=settings.app_env == "development")


@app.entrypoint
def handle_invocation(payload: dict[str, Any]) -> dict[str, Any]:
    request = AgentInvocationRequest.model_validate(payload)
    logger.info(
        "agent_invocation_started",
        request_id=request.request_id,
        group_id=request.group_id,
        session_id=request.session_id,
    )
    response = invoke_scheduling_agent(request, settings)
    logger.info(
        "agent_invocation_completed",
        request_id=request.request_id,
        result_kind=response.result.kind,
    )
    return response.model_dump(mode="json")


def main() -> None:
    app.run()


if __name__ == "__main__":
    main()
