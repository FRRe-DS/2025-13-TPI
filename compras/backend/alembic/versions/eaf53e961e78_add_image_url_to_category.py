"""add image_url to category

Revision ID: eaf53e961e78
Revises: 
Create Date: 2025-10-17 17:40:48.208721

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'eaf53e961e78'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('category', sa.Column('image_url', sa.String(length=512), nullable=True))



def downgrade() -> None:
    """Downgrade schema."""
    pass
