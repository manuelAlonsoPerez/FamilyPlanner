from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        populate_by_name=True,
    )

    app_env: Literal["development", "test", "production"] = Field(
        default="development",
        validation_alias="APP_ENV",
    )
    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR"] = Field(
        default="INFO",
        validation_alias="LOG_LEVEL",
    )
    aws_region: str = Field(
        default="eu-central-1",
        min_length=1,
        validation_alias="AWS_REGION",
    )
    bedrock_model_id: str = Field(
        default="eu.amazon.nova-micro-v1:0",
        min_length=1,
        validation_alias="BEDROCK_MODEL_ID",
    )
    agent_max_steps: int = Field(
        default=6,
        ge=1,
        le=20,
        validation_alias="AGENT_MAX_STEPS",
    )
    agent_request_timeout_seconds: int = Field(
        default=45,
        ge=1,
        le=300,
        validation_alias="AGENT_REQUEST_TIMEOUT_SECONDS",
    )
    agent_context_message_limit: int = Field(
        default=20,
        ge=1,
        le=20,
        validation_alias="AGENT_CONTEXT_MESSAGE_LIMIT",
    )
    agent_max_output_tokens: int = Field(
        default=1_024,
        ge=64,
        le=4_096,
        validation_alias="AGENT_MAX_OUTPUT_TOKENS",
    )
