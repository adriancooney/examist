from os.path import join, dirname
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

{% macro var(name, value, default=None, str=True, required=True) -%}
    {%- if not value and not default and required -%}
        raise RuntimeError("Missing enviroment variable '%s' during app configuration." % ("{{name}}"))
    {%- else -%}
        {%- if not value and default -%}
            {%- set value = default -%}
        {%- elif not value and not required -%}
            {%- set str = False -%}
            {%- set value = "None" -%}
        {%- endif -%}

        {{name}} = {% if str %}"{{value}}"{% else %}{{value}}{% endif %}
    {%- endif %}
{%- endmacro -%}

{{ var("DB_USER", DB_USER) }}
{{ var("DB_PASS", DB_PASS) }}
{{ var("DB_HOST", DB_HOST, default="localhost") }}
{{ var("DB_PORT", DB_PORT, default="5432", str=False) }}
{{ var("DB_NAME", DB_NAME) }}

{{ var("APP_PORT", APP_PORT, str=False) }}
{{ var("APP_HOST", APP_HOST, default="127.0.0.1") }}
{{ var("APP_DEBUG", APP_DEBUG, default="False", str=False) }}
{{ var("APP_LOG", APP_LOG, required=False) }}
{{ var("DB_NAME", DB_NAME) }}

DATABASE_URI = "postgresql+psycopg2://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"