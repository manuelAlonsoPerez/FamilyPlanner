# Family Planner Scheduling Agent

Python runtime for the Family Planner scheduling agent, built with the Strands Agents SDK and intended for Amazon Bedrock AgentCore Runtime.

The agent interprets group scheduling conversations and creates structured calendar proposals. It does not approve proposals or execute calendar mutations.

## Local requirements

- Python 3.12
- [`uv`](https://docs.astral.sh/uv/)
- AWS CLI 2.32 or later
- Node.js 20 or later
- [Amazon Bedrock AgentCore CLI](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-get-started-cli.html)
- A non-root AWS development identity

## Configuration

The development defaults use:

- AWS region: `eu-central-1` (Frankfurt)
- Bedrock inference profile: `eu.amazon.nova-micro-v1:0`
- Model: Amazon Nova Micro

Nova Micro is Bedrock's lowest-cost Amazon Nova understanding model and supports text, the Converse API, and tool use. Bedrock inference is usage-priced rather than permanently free; use AWS credits and budget alarms where available.

Copy the safe example configuration:

```bash
cp .env.example .env
```

The `.env` file is ignored by Git. Never store AWS access keys, OAuth credentials, calendar tokens, or other secrets in it.

Authenticate using a non-root profile before making AWS calls:

```bash
aws sts get-caller-identity --profile family-planner-dev
```

Do not continue if the returned ARN ends in `:root`.

## Install

```bash
uv sync --frozen --dev
```

## Run locally

Validate package configuration without AWS credentials or a model invocation:

```bash
uv run family-planner-agent check
```

Invoke the agent with one scheduling message:

```bash
AWS_PROFILE=family-planner-dev \
uv run family-planner-agent invoke \
  "Plan a family dinner this Friday at 18:00 in Europe/Oslo."
```

The `invoke` command calls Amazon Bedrock and incurs model usage. The response is
validated against the versioned Pydantic result contract before it is returned.

Start the AgentCore-compatible local HTTP runtime:

```bash
AWS_PROFILE=family-planner-dev uv run family-planner-agentcore
```

## Quality checks

```bash
uv lock --check
uv run ruff format --check .
uv run ruff check .
uv run mypy src
uv run pytest --cov --cov-report=term-missing
uv build --clear
```

## Current status

The runtime now includes:

- an installable `src/family_planner_agent` package;
- typed invocation, calendar-event, and agent-result contracts;
- `NoAction`, `Clarification`, `Proposal`, and `Refusal` results;
- a bounded Strands agent configured for Amazon Nova Micro;
- an AgentCore application entry point;
- local CLI configuration and invocation commands;
- contract and unit tests that do not call Bedrock.

This is still an initial agent. It has no application tools, persistent sessions,
calendar reads, proposal storage, approval transitions, or calendar write access.
Those capabilities remain separate implementation phases.

See:

- [Backend and agents implementation guide](../../BACKEND_AGENTS_IMPLEMENTATION_GUIDE.md)
- [System architecture](../../ARCHITECTURE.md)

No real family conversations or calendar exports may be used as test fixtures.
