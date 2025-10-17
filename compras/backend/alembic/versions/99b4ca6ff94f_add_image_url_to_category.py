"""add image_url to category

Revision ID: 99b4ca6ff94f
Revises: 
Create Date: 2025-10-17 16:56:16.591486

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '99b4ca6ff94f'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('category', sa.Column('image_url', sa.String(length=512), nullable=True))



def downgrade() -> None:
    """Downgrade schema."""
    pass
