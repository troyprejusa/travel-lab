"""Foundation: UUID support and vacation settings."""

from alembic import op

revision = '001_foundation'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.execute("""
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    """)
    op.execute("""
        CREATE TYPE vacation_setting AS ENUM (
            'tropical', 
            'wilderness', 
            'city', 
            'historical',
            'countryside',
            'road_trip',
            'winter'
        );
    """)


def downgrade():
    op.execute('DROP TYPE vacation_setting')
