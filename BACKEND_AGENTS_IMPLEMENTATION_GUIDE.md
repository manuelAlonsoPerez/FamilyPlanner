# Family Planner Backend and Agents Implementation Guide

> Status: Part 1 complete — project setup  
> Scope: Backend and agent implementation only  
> Architecture source: [ARCHITECTURE.md](./ARCHITECTURE.md)  
> Last reviewed: 25 August 2026

This is an incremental implementation guide for the Family Planner backend and its Strands scheduling agent. It starts with a reproducible project setup and will later cover domain contracts, the local agent, tools, AgentCore deployment, asynchronous orchestration, approval policies, calendar execution, security, observability, and testing.

The commands in this guide are instructions for the future implementation. Creating this document does not execute them or scaffold application code.

## Guide roadmap

- [x] Part 1 — Project setup
- [ ] Part 2 — Domain contracts and proposal state machine
- [ ] Part 3 — First local Strands agent
- [ ] Part 4 — Read-only agent tools and proposal creation
- [ ] Part 5 — AgentCore Runtime deployment
- [ ] Part 6 — Application API and asynchronous orchestration
- [ ] Part 7 — Approval policy and calendar command executor
- [ ] Part 8 — Google Calendar adapter
- [ ] Part 9 — Security, observability, and evaluation
- [ ] Part 10 — Integration tests and deployment pipeline

---

# Part 1 — Project setup

## 1. Goal

At the end of this part, the repository should have:

- a dedicated Python 3.12 application for the Strands agent runtime;
- dependency and lockfile management through `uv`;
- linting, type-checking, and test tooling;
- an authenticated local AWS profile;
- verified Amazon Bedrock model availability;
- the current Amazon Bedrock AgentCore CLI installed;
- configuration conventions that do not leak credentials;
- a planned backend folder structure;
- a clean baseline from which the first agent can be implemented.

This part deliberately does **not**:

- implement an agent;
- create calendar tools;
- deploy AWS infrastructure;
- create database tables;
- configure Google OAuth;
- create AgentCore resources;
- add a web API.

## 2. Setup decisions

### 2.1 Python for the agent boundary

Use Python 3.12 for the agent and backend workers.

Reasons:

- Strands supports Python 3.10 and later;
- the Python SDK currently has broad support for structured output, tools, hooks, sessions, and model providers;
- Pydantic gives the project a strict validation boundary around model output;
- the official AgentCore Python path supports direct SDK integration and custom runtimes;
- Python has mature Google Calendar, AWS, testing, and OpenTelemetry libraries.

The web frontend can remain TypeScript. Cross-language communication should use versioned JSON contracts rather than shared source code.

### 2.2 Start with an independently deployable agent application

The agent runtime should be its own Python application under:

```text
backend/agent-runtime/
```

It should not be placed inside a Lambda function or Next.js application. AgentCore Runtime has a distinct deployment lifecycle and security boundary.

### 2.3 Use the AgentCore SDK integration first

Start with `BedrockAgentCoreApp` rather than a custom FastAPI container.

This initial path provides:

- the AgentCore invocation server;
- the required runtime protocol;
- local execution support;
- less infrastructure code during the first learning iteration.

A custom FastAPI runtime remains possible later if custom middleware or HTTP behavior becomes necessary. It is not justified during project setup.

### 2.4 Keep writes outside the agent runtime

The agent application will eventually receive read-only tools and a `create_proposal` tool. Calendar mutations will be implemented in a separate command executor.

This separation must already be visible in the folder structure. Do not create a generic `calendar_tool` that mixes reads and writes.

### 2.5 Use one lockfile per deployable Python application initially

Do not create a Python workspace on day one.

The first Python deployable is the agent runtime, so it should own:

```text
backend/agent-runtime/pyproject.toml
backend/agent-runtime/uv.lock
```

When Lambda workers are introduced, reassess whether they should:

- have separate lockfiles for small deployment artifacts; or
- join a `uv` workspace with internal domain packages.

Prematurely creating a workspace makes AgentCore packaging and Lambda dependency boundaries harder to understand.

## 3. Proposed repository structure

The eventual repository layout should be:

```text
FamilyPlanner/
├── ARCHITECTURE.md
├── BACKEND_AGENTS_IMPLEMENTATION_GUIDE.md
├── README.md
├── LICENSE
├── .editorconfig
├── .gitignore
├── frontend/                         # Next.js application; separate guide
├── backend/
│   ├── agent-runtime/                # Strands agent deployed to AgentCore
│   │   ├── pyproject.toml
│   │   ├── uv.lock
│   │   ├── .python-version
│   │   ├── .env.example
│   │   ├── README.md
│   │   ├── src/
│   │   │   └── family_planner_agent/
│   │   │       ├── __init__.py
│   │   │       ├── main.py           # BedrockAgentCoreApp entry point
│   │   │       ├── agent.py          # Strands Agent construction
│   │   │       ├── config.py         # Typed environment settings
│   │   │       ├── logging.py        # Structured logging setup
│   │   │       ├── contracts/
│   │   │       │   ├── invocation.py
│   │   │       │   └── proposal.py
│   │   │       ├── prompts/
│   │   │       │   └── scheduling.py
│   │   │       └── tools/
│   │   │           ├── group_context.py
│   │   │           ├── calendar_read.py
│   │   │           └── proposal.py
│   │   └── tests/
│   │       ├── unit/
│   │       ├── contract/
│   │       └── evaluation/
│   ├── functions/                    # Added when async workers are built
│   │   ├── agent-orchestrator/
│   │   ├── approval-policy/
│   │   ├── calendar-executor/
│   │   └── calendar-webhook/
│   └── packages/                     # Added only when shared code is needed
│       ├── domain/
│       └── calendar-providers/
├── amplify/                          # Amplify Gen 2 backend definition
└── docs/
    ├── adr/                          # Architecture decision records
    └── runbooks/
```

Only create directories when they are needed by the current implementation part. Empty placeholder directories add noise and are not useful.

## 4. Prerequisites

### 4.1 Accounts

Prepare:

- an AWS account owned or controlled by the project entrant;
- registration for the Agents for Humans Hackathon;
- an AWS Builder ID for the final submission;
- access to the offered AWS credit, if still available;
- an AWS IAM Identity Center user or another short-lived credential mechanism.

Avoid using the AWS root user for local development.

### 4.2 Required local tools

Install:

- Git;
- AWS CLI v2;
- Python 3.12, managed through `uv`;
- `uv`;
- Node.js 20 or later;
- npm, included with Node.js;
- the AgentCore CLI;
- Docker Desktop or another container engine only when container testing becomes necessary.

Docker is not required for the initial AgentCore SDK integration.

### 4.3 Verify the current machine

From the repository root:

```bash
git --version
aws --version
node --version
npm --version
uv --version
```

Expected minimums:

- Node.js: 20 or later for the AgentCore CLI;
- Python: 3.12 for this project;
- AWS CLI: keep it current; Bedrock model-access management requires AWS CLI 2.27.42 or later;
- `uv`: use a current stable release.

Do not paste the output of credential-related commands into public issues or the repository.

## 5. Install `uv` and Python

### 5.1 Install `uv` on macOS

Recommended:

```bash
brew install uv
```

Official standalone alternative:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Use one installation method, not both.

Verify:

```bash
uv --version
```

### 5.2 Install and pin Python 3.12

```bash
uv python install 3.12
```

The project initialization step will create a local `.python-version` pin. Developers should not rely on whichever system Python happens to be installed.

## 6. Configure local AWS access

### 6.1 Prefer temporary credentials

Use IAM Identity Center/SSO when available:

```bash
aws configure sso --profile family-planner-dev
aws sso login --profile family-planner-dev
```

Verify the active identity:

```bash
aws sts get-caller-identity --profile family-planner-dev
```

The output includes an AWS account ID and ARN. Treat those as operational information and avoid committing them unnecessarily.

If IAM Identity Center is not available, use another AWS-supported temporary credential flow. Long-lived access keys in `.env` files are not an acceptable default.

### 6.2 Select one development region

Choose a region only after confirming that it supports:

- Amazon Bedrock;
- the intended foundation model or inference profile;
- Amazon Bedrock AgentCore;
- the surrounding services used by the architecture.

Use one region during the first implementation to avoid cross-region IAM, latency, and observability confusion.

Set shell variables for local commands:

```bash
export AWS_PROFILE=family-planner-dev
export AWS_REGION=<chosen-region>
export AWS_DEFAULT_REGION="$AWS_REGION"
```

`<chosen-region>` is intentionally a placeholder. Do not copy it literally.

Confirm the CLI resolves the profile and region:

```bash
aws sts get-caller-identity
aws configure get region --profile "$AWS_PROFILE"
```

### 6.3 Local developer permissions

The development identity needs enough permission to:

- inspect available Bedrock models;
- invoke the selected model;
- create and operate the project's AgentCore development resources;
- inspect CloudWatch logs and traces;
- assume project-specific deployment roles later.

Bedrock inference requires, at minimum, the relevant:

- `bedrock:InvokeModel`;
- `bedrock:InvokeModelWithResponseStream` when streaming is used.

Some third-party Bedrock models require AWS Marketplace subscription permissions for first use. Model access is generally enabled automatically when the identity has the required permissions, but the first subscription can take time.

Do not use `AdministratorAccess` as the final runtime policy. A temporary sandbox administrator can accelerate an initial personal account spike, but the deployed runtime must receive a separate least-privilege role.

## 7. Verify Bedrock model access

List available text-capable models:

```bash
aws bedrock list-foundation-models \
  --region "$AWS_REGION" \
  --by-output-modality TEXT
```

Choose a model or inference profile that:

- is available in the selected region;
- supports reliable tool use;
- supports the structured-output behavior required by the project;
- has acceptable latency and token cost;
- can be used during the judging period.

Record the selected identifier locally:

```bash
export BEDROCK_MODEL_ID=<selected-model-or-inference-profile-id>
```

Do not hard-code a model identifier across the codebase. It is deployment configuration.

Before implementing the agent, perform one small Bedrock invocation using an official example compatible with the selected model. Request payloads differ by model, so do not copy an invocation body written for a different provider.

If the first invocation returns `AccessDeniedException`:

1. verify the profile and account;
2. verify the selected region;
3. verify Bedrock invocation permissions;
4. verify Marketplace permissions for the model provider;
5. allow time for a first-use subscription to finish;
6. verify the model or inference profile identifier.

Do not switch to static access keys as a workaround.

## 8. Install the AgentCore CLI

The current AgentCore CLI is distributed through npm:

```bash
npm install -g @aws/agentcore
```

Verify:

```bash
agentcore --version
agentcore --help
```

The CLI provides:

- `agentcore create`;
- `agentcore dev`;
- `agentcore deploy`;
- `agentcore invoke`;
- `agentcore status`.

Do not install the older `bedrock-agentcore-starter-toolkit` for this project. Current Strands and AWS guidance states that the AgentCore CLI replaces it.

During project setup, install and verify the CLI but do not run `agentcore create` yet. The next parts will first establish the Family Planner invocation and proposal contracts; then the runtime scaffold can be generated without accepting an unsuitable default data shape.

## 9. Initialize the agent application

From the repository root:

```bash
mkdir -p backend
uv init --app --python 3.12 backend/agent-runtime
cd backend/agent-runtime
```

Inspect the generated files before editing them:

```bash
ls
```

The initialized project should include a `pyproject.toml` and `.python-version`. Current `uv` application templates normally use a packaged `src` layout; if the generated template differs, prefer this final package path:

```text
src/family_planner_agent/
```

Set the project metadata name to:

```toml
[project]
name = "family-planner-agent"
requires-python = ">=3.12,<3.13"
```

Pinning the minor Python line makes local development and AgentCore packaging more predictable. Upgrading to Python 3.13 should be a deliberate compatibility change.

Remove any generated demonstration function only when Part 2 introduces the real package contracts.

## 10. Add runtime dependencies

From `backend/agent-runtime`:

```bash
uv add \
  strands-agents \
  bedrock-agentcore \
  boto3 \
  pydantic \
  pydantic-settings \
  structlog
```

Purpose:

- `strands-agents`: agent, model, tools, hooks, and conversation behavior;
- `bedrock-agentcore`: AgentCore runtime application integration;
- `boto3`: explicit AWS SDK dependency for application-owned AWS calls;
- `pydantic`: invocation, tool, and proposal contracts;
- `pydantic-settings`: typed environment configuration;
- `structlog`: structured application logs without relying on interpolated text.

`boto3` may be present transitively or in an AWS runtime, but declaring it explicitly prevents local/runtime version assumptions.

Do not add these yet:

- Google Calendar libraries;
- DynamoDB helper libraries;
- FastAPI;
- an ORM;
- AgentCore Memory or Gateway integration packages;
- broad Strands community tool packages.

Dependencies should be introduced with the feature that uses them.

## 11. Add development dependencies

```bash
uv add --dev \
  mypy \
  pytest \
  pytest-asyncio \
  pytest-cov \
  ruff
```

Purpose:

- `ruff`: formatting and linting;
- `mypy`: static type checking;
- `pytest`: test runner;
- `pytest-asyncio`: asynchronous tool and entry-point tests;
- `pytest-cov`: coverage visibility.

Do not add snapshot or model-evaluation frameworks until the evaluation approach is defined.

Run:

```bash
uv sync
```

`uv` creates the virtual environment and lockfile. Commit `uv.lock`; do not commit `.venv`.

## 12. Configure Python quality tools

Add the following baseline to `backend/agent-runtime/pyproject.toml`, adapting existing tables rather than duplicating them:

```toml
[tool.ruff]
line-length = 100
target-version = "py312"

[tool.ruff.lint]
select = [
  "E",
  "F",
  "I",
  "UP",
  "B",
  "SIM",
  "ASYNC",
  "S",
]

[tool.ruff.lint.per-file-ignores]
"tests/**/*.py" = ["S101"]

[tool.pytest.ini_options]
addopts = "-ra --strict-config --strict-markers"
testpaths = ["tests"]
asyncio_mode = "auto"

[tool.coverage.run]
branch = true
source = ["family_planner_agent"]

[tool.coverage.report]
show_missing = true
skip_covered = true

[tool.mypy]
python_version = "3.12"
strict = true
warn_unreachable = true
pretty = true
```

Why include Ruff's `S` rules:

- this service handles credentials, external actions, and untrusted text;
- obvious security mistakes should appear during ordinary linting;
- test assertions receive a narrow, explicit exception.

Do not silence broad rule families to make the first check green. Suppress one rule on one line only when the code has a documented reason.

## 13. Configuration conventions

### 13.1 Environment file

Create `backend/agent-runtime/.env.example` containing names and safe examples only:

```dotenv
APP_ENV=development
LOG_LEVEL=INFO

AWS_REGION=<chosen-region>
AWS_PROFILE=family-planner-dev
BEDROCK_MODEL_ID=<selected-model-or-inference-profile-id>

AGENT_MAX_STEPS=8
AGENT_REQUEST_TIMEOUT_SECONDS=45
AGENT_CONTEXT_MESSAGE_LIMIT=30
```

Rules:

- commit `.env.example`;
- never commit `.env`;
- do not place AWS access keys, refresh tokens, client secrets, or session tokens in either file;
- production configuration will come from the deployment environment and AWS-managed secret services;
- fail startup when required production settings are absent;
- do not silently default production to a costly or region-specific model.

### 13.2 Local environment loading

Prefer exporting `AWS_PROFILE` and region through the shell. If local `.env` loading is later enabled through `pydantic-settings`, ensure `.env` is ignored by Git.

AWS SDK credential discovery should use the normal provider chain. Application code should not read access-key strings into custom settings fields.

### 13.3 Configuration model planned for Part 2

The future typed settings object should separate:

- application behavior;
- model selection;
- agent limits;
- AWS resource references;
- observability options.

It must not expose secret values through `repr`, startup logs, or validation errors.

## 14. Git ignore baseline

The repository `.gitignore` should eventually include:

```gitignore
# Python
**/.venv/
**/__pycache__/
**/*.py[cod]
**/.pytest_cache/
**/.mypy_cache/
**/.ruff_cache/
**/.coverage
**/htmlcov/

# Local configuration and credentials
**/.env
**/.env.*
!**/.env.example

# macOS
.DS_Store

# IDE-local files
.vscode/
.idea/

# Build output
**/dist/
**/build/
```

Before adding `.vscode/` to the ignore list, decide whether the team wants to commit shared workspace recommendations. Do not ignore useful team settings accidentally.

Never add:

- AWS credential files;
- downloaded OAuth client-secret JSON;
- provider refresh tokens;
- `.pem` private keys;
- production event exports;
- real family chat fixtures.

## 15. Package boundaries

### Agent runtime owns

- invocation request/response validation;
- construction of the Strands scheduling agent;
- prompt assembly;
- bounded conversation context;
- read-only application tools;
- proposal creation;
- user-visible clarification/refusal output;
- agent trace correlation.

### Agent runtime does not own

- authentication of browser users;
- group membership storage;
- approval policy evaluation;
- approval state transitions;
- Google OAuth callbacks;
- provider credential storage;
- calendar create/update/delete execution;
- webhook processing.

These boundaries prevent the model-facing runtime from accumulating application-wide privileges.

## 16. Naming conventions

Use:

- Python package: `family_planner_agent`;
- distribution name: `family-planner-agent`;
- AgentCore agent name: `FamilyPlannerSchedulingAgent`;
- environment names: `dev` and `demo`;
- AWS resource prefix: `family-planner`;
- correlation IDs: UUID strings generated at the first accepted application event;
- group IDs and proposal IDs: opaque application-generated IDs.

Do not encode email addresses, names, or calendar titles into AWS resource names, logs, session IDs, or partition keys visible outside the application domain.

## 17. AgentCore session identity convention

Plan two separate identifiers:

- `actor_id`: stable opaque group or user identity used for authorization and optional memory;
- `session_id`: one conversation/session execution context.

For the initial group scheduling agent:

- derive authorization from the application backend, never from model-provided IDs;
- use a stable opaque group identifier as part of the actor context only after reviewing AgentCore Memory semantics;
- use an AgentCore-compatible session ID that does not contain personal data;
- propagate the same correlation ID into logs and traces;
- do not use a group name or email address as a session ID.

The final mapping will be specified before AgentCore Memory is enabled.

## 18. Local verification commands

After dependency installation, run from `backend/agent-runtime`:

```bash
uv run python --version
uv lock --check
uv run ruff format --check .
uv run ruff check .
uv run mypy src
uv run pytest
```

During the initial scaffold, `mypy src` and `pytest` may need to wait until Part 2 creates the package and first tests. Do not add fake tests solely to make the command pass.

Verify imports without invoking a paid model:

```bash
uv run python -c "import strands; import bedrock_agentcore; print('agent dependencies available')"
```

Verify AWS identity:

```bash
aws sts get-caller-identity
```

Verify the selected Bedrock configuration:

```bash
test -n "$AWS_REGION"
test -n "$BEDROCK_MODEL_ID"
```

The setup check must not invoke the model repeatedly. A single intentional smoke invocation belongs in Part 3.

## 19. Initial README content for the agent application

`backend/agent-runtime/README.md` should explain:

- what the scheduling agent does;
- that it proposes but does not execute calendar mutations;
- required Python, `uv`, AWS CLI, Node.js, and AgentCore CLI versions;
- how to authenticate the `family-planner-dev` AWS profile;
- required environment variables;
- local lint/type/test commands;
- local AgentCore development commands once introduced;
- where traces and logs are found;
- the absence of real secrets and personal data in fixtures.

Keep operational commands close to the deployable application. The repository-level README should provide the product overview and link to this guide.

## 20. CI baseline to add after Part 2

Once the first package and tests exist, the backend CI job should:

1. check out the repository;
2. install `uv`;
3. install Python from `.python-version`;
4. run `uv sync --frozen --dev`;
5. run `uv run ruff format --check .`;
6. run `uv run ruff check .`;
7. run `uv run mypy src`;
8. run `uv run pytest --cov --cov-report=term-missing`.

CI must not require AWS credentials for unit tests. Bedrock and AgentCore integration tests should be opt-in jobs with short-lived credentials and explicit cost controls.

Do not deploy from pull requests originating from untrusted forks.

## 21. Hackathon compliance during setup

Because the rules require a new project and disclosure of pre-existing work:

- preserve Git history from the beginning;
- record the date project implementation starts;
- document any template or pre-existing code retained from scaffolding;
- retain dependency licenses and notices where required;
- add an MIT or Apache license before submission;
- do not commit third-party proprietary examples without permission;
- keep setup reproducible from the public repository;
- ensure the project can be tested without paid access supplied by judges.

Generated files from `uv` and the official AgentCore CLI are standard development tooling. If substantial example logic is retained, mention it in the project acknowledgements.

## 22. Project setup checklist

### Repository

- [ ] Current branch is dedicated to the setup work.
- [ ] No unrelated or pre-existing application code is silently incorporated.
- [ ] Root `.gitignore` protects local environments and secrets.
- [ ] An open-source license has been selected.

### Local tooling

- [ ] `uv` is installed.
- [ ] Python 3.12 is installed and pinned.
- [ ] AWS CLI v2 is current.
- [ ] Node.js 20 or later is installed.
- [ ] AgentCore CLI is installed and responds.

### AWS

- [ ] A non-root development identity is configured.
- [ ] `family-planner-dev` uses temporary credentials where possible.
- [ ] One AWS development region is selected.
- [ ] The selected Bedrock model/inference profile is available.
- [ ] A minimal model invocation has been verified once.
- [ ] A budget alert exists before cloud deployment.

### Agent package

- [ ] `backend/agent-runtime` is initialized with `uv`.
- [ ] Runtime and development dependencies are locked.
- [ ] `.env.example` contains no secrets.
- [ ] Ruff, mypy, and pytest configuration is present.
- [ ] Runtime ownership boundaries are documented.

## 23. Definition of done for Part 1

Project setup is complete when a new developer can:

1. clone the repository;
2. install the documented prerequisites;
3. authenticate through the named AWS profile;
4. run `uv sync --frozen --dev`;
5. verify Strands and AgentCore imports;
6. list available Bedrock models in the selected region;
7. run the quality commands that apply to the current scaffold;
8. understand exactly where the agent runtime will live;
9. confirm that no secret or real calendar data is committed.

No agent response is expected yet.

## 24. Next implementation part

Part 2 should define the deterministic contracts before any prompt or agent behavior:

- invocation request and response;
- message context;
- normalized calendar event;
- `NoAction`, `Clarification`, `Proposal`, and `Refusal` results;
- create/update/delete proposal payloads;
- proposal status and transition rules;
- contract versioning;
- Pydantic validation tests.

Defining these first prevents model output from becoming the application's implicit API.

## 25. Project setup references

- [Strands Agents quickstart overview](https://strandsagents.com/docs/user-guide/quickstart/overview/)
- [Python Strands deployment to AgentCore](https://strandsagents.com/docs/user-guide/deploy/deploy_to_bedrock_agentcore/python/)
- [AgentCore CLI getting started](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-get-started-cli.html)
- [Develop agents with AgentCore](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/develop-agents.html)
- [Amazon Bedrock inference prerequisites](https://docs.aws.amazon.com/bedrock/latest/userguide/inference-prereq.html)
- [Amazon Bedrock model access](https://docs.aws.amazon.com/bedrock/latest/userguide/model-access.html)
- [AWS CLI IAM Identity Center configuration](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html)
- [`uv` installation](https://docs.astral.sh/uv/getting-started/installation/)
- [`uv` project creation](https://docs.astral.sh/uv/concepts/projects/init/)

Recheck command syntax and service requirements against current official documentation when each implementation step is performed. Strands and AgentCore are evolving quickly.
