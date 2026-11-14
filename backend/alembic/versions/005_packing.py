"""Trip packing lists."""

from alembic import op

revision = '0001_initial'
down_revision = '004_polls'
branch_labels = None
depends_on = None


def upgrade():
    op.execute("""
        CREATE TABLE IF NOT EXISTS packing (
            id BIGSERIAL PRIMARY KEY,
            trip_id UUID NOT NULL references trip ON DELETE CASCADE,
            item VARCHAR(64) NOT NULL,
            quantity INTEGER NOT NULL,
            description VARCHAR(200),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            created_by VARCHAR(255) references traveller(email) ON DELETE SET NULL,
            packed_by VARCHAR(255) references traveller(email) ON DELETE SET NULL 
        );
    """)


def downgrade():
    op.execute('DROP TABLE packing')
