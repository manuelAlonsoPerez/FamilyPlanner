from family_planner_agent.config import Settings


def test_safe_default_model_configuration() -> None:
    settings = Settings(_env_file=None)

    assert settings.aws_region == "eu-central-1"
    assert settings.bedrock_model_id == "eu.amazon.nova-micro-v1:0"
    assert settings.agent_max_steps == 6
    assert "access_key" not in Settings.model_fields
    assert "secret" not in Settings.model_fields
