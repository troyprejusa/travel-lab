"""Trip itineraries and messages."""

from alembic import op

revision = '003_itineraries_and_messages'
down_revision = '002_travellers_and_trips'
branch_labels = None
depends_on = None


def upgrade():
    op.execute("""
        CREATE TABLE IF NOT EXISTS itinerary (
            id BIGSERIAL PRIMARY KEY,
            trip_id uuid NOT NULL references trip ON DELETE CASCADE,
            title VARCHAR(60) NOT NULL,
            description VARCHAR(200),
            start_time TIMESTAMP NOT NULL,
            end_time TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            created_by VARCHAR(255) references traveller(email) ON DELETE SET NULL
        );
    """)
    op.execute("""
        CREATE TABLE IF NOT EXISTS message (
            id BIGSERIAL PRIMARY KEY,
            trip_id uuid NOT NULL references trip ON DELETE CASCADE,
            content VARCHAR(1100) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            created_by VARCHAR(255) references traveller(email) ON DELETE SET NULL
        );
    """)


def downgrade():
    op.execute('DROP TABLE message')
    op.execute('DROP TABLE itinerary')
