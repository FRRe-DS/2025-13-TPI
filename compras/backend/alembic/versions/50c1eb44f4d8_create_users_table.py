"create users table"

from alembic import op
import sqlalchemy as sa

revision = "xxxx"
down_revision = "<tu_ultima_revision>"
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        "users",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("keycloak_sub", sa.String(length=64), nullable=False, unique=True),
        sa.Column("nombre", sa.String(length=150), nullable=False),
        sa.Column("email", sa.String(length=150), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_users_keycloak_sub", "users", ["keycloak_sub"])
    op.create_index("ix_users_email", "users", ["email"])

def downgrade():
    op.drop_index("ix_users_email", table_name="users")
    op.drop_index("ix_users_keycloak_sub", table_name="users")
    op.drop_table("users")
