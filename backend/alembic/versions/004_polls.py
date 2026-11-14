"""Polls, options, and votes."""

from alembic import op

revision = '004_polls'
down_revision = '003_itineraries_and_messages'
branch_labels = None
depends_on = None


def upgrade():
    op.execute("""
        CREATE TABLE IF NOT EXISTS poll (
            id BIGSERIAL PRIMARY KEY,
            trip_id uuid NOT NULL references trip ON DELETE CASCADE,
            title VARCHAR(40) NOT NULL,
            description VARCHAR(200),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            created_by VARCHAR(255) references traveller(email) ON DELETE SET NULL
        );
    """)
    op.execute("""
        CREATE TABLE IF NOT EXISTS poll_option (
            id BIGSERIAL PRIMARY KEY,
            poll_id BIGINT NOT NULL references poll ON DELETE CASCADE,
            option VARCHAR(120) NOT NULL
        );
    """)
    op.execute("""
        CREATE TABLE IF NOT EXISTS poll_vote (
            id BIGSERIAL PRIMARY KEY,
            poll_id BIGINT NOT NULL references poll ON DELETE CASCADE,
            vote BIGINT NOT NULL references poll_option ON DELETE CASCADE,
            voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            voted_by VARCHAR(255) NOT NULL references traveller(email) ON DELETE CASCADE,
            UNIQUE (poll_id, voted_by)
        );
    """)


def downgrade():
    op.execute('DROP TABLE poll_vote')
    op.execute('DROP TABLE poll_option')
    op.execute('DROP TABLE poll')
