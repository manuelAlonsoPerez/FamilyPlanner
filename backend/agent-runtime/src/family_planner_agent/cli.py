import argparse
import json
from datetime import UTC, datetime
from uuid import uuid4

from .agent import invoke_scheduling_agent
from .config import Settings
from .contracts import AgentInvocationRequest, MessageContext


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Run the Family Planner scheduling agent.")
    subparsers = parser.add_subparsers(dest="command", required=True)
    subparsers.add_parser("check", help="Validate local configuration without calling Bedrock.")

    invoke_parser = subparsers.add_parser(
        "invoke",
        help="Send one local prompt to Bedrock. This incurs model usage.",
    )
    invoke_parser.add_argument("message", help="Scheduling message to analyze.")
    invoke_parser.add_argument("--timezone", default="Europe/Oslo")
    return parser


def main() -> None:
    args = build_parser().parse_args()
    settings = Settings()

    if args.command == "check":
        print(
            json.dumps(
                {
                    "status": "ok",
                    "environment": settings.app_env,
                    "region": settings.aws_region,
                    "model_id": settings.bedrock_model_id,
                },
                indent=2,
            )
        )
        return

    now = datetime.now(UTC)
    request = AgentInvocationRequest(
        request_id=str(uuid4()),
        group_id="local-demo-group",
        actor_id="local-demo-user",
        session_id=str(uuid4()),
        timezone=str(args.timezone),
        messages=[
            MessageContext(
                message_id=str(uuid4()),
                sender_id="local-demo-user",
                sender_display_name="Local user",
                body=str(args.message),
                sent_at=now,
            )
        ],
    )
    response = invoke_scheduling_agent(request, settings)
    print(response.model_dump_json(indent=2))


if __name__ == "__main__":
    main()
