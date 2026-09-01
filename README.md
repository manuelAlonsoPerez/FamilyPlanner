# Family Planner

Family Planner turns group chats into calendar actions. A Strands AI agent understands plans, proposes changes, gathers approvals, and updates the group administrator's calendar through a separate authorized executor.

## Documentation

- [Architecture](./ARCHITECTURE.md)
- [Backend and agents implementation guide](./BACKEND_AGENTS_IMPLEMENTATION_GUIDE.md)
- [Frontend implementation guide](./FRONTEND_IMPLEMENTATION_GUIDE.md)
- [Agent runtime setup](./backend/agent-runtime/README.md)

## Current status

The repository now includes a responsive Next.js frontend prototype with a group
calendar, family chat, member view, and human-approval proposal card. It uses
local fixture data only.

The backend now includes an installable, typed Strands scheduling agent with
AgentCore and local CLI entry points. Authentication, persistence, application
tools, frontend integration, and calendar mutations are not connected yet.

The planned stack uses:

- Strands Agents SDK;
- Amazon Bedrock AgentCore Runtime;
- Amazon Bedrock;
- Python 3.12 and `uv`;
- AWS-managed application services described in the architecture.

## Model choice

Development uses Amazon Nova Micro through the EU inference profile `eu.amazon.nova-micro-v1:0`. Nova Micro is the most economical Amazon Nova understanding model and supports the text and tool-use capabilities required for the initial scheduling agent.

Amazon Bedrock is usage-priced, not permanently free. Keep requests bounded and configure AWS Budgets before deployment.

## Security

Use a non-root AWS development identity. Do not commit credentials, OAuth secrets, calendar tokens, private conversations, or real calendar exports.
