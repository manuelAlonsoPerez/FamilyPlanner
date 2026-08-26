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

## Quality checks

```bash
uv lock --check
uv run ruff format --check .
uv run ruff check .
```

Type-checking and tests become required when Part 2 adds the package and domain contracts:

```bash
uv run mypy src
uv run pytest
```

## Current status

Project setup is in progress. The generated `main.py` remains a placeholder until the deterministic invocation and proposal contracts are introduced.

See:

- [Backend and agents implementation guide](../../BACKEND_AGENTS_IMPLEMENTATION_GUIDE.md)
- [System architecture](../../ARCHITECTURE.md)

No real family conversations or calendar exports may be used as test fixtures.
