"""Travellers, trips, and their relationship."""

from alembic import op

revision = '002_travellers_and_trips'
down_revision = '001_foundation'
branch_labels = None
depends_on = None


def upgrade():
    op.execute("""
        CREATE TABLE IF NOT EXISTS traveller (
            id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
            first_name VARCHAR(40),
            last_name VARCHAR(40),
            email VARCHAR(255) UNIQUE NOT NULL,
            phone VARCHAR(11)
        );
    """)
    op.execute("""
        CREATE TABLE IF NOT EXISTS trip (
            id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
            destination VARCHAR(60) NOT NULL,
            description VARCHAR(200),
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            vacation_type vacation_setting NOT NULL, 
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            created_by VARCHAR(255) references traveller(email) ON DELETE SET NULL
        );
    """)
    op.execute("""
        CREATE TABLE IF NOT EXISTS traveller_trip (
                traveller_id uuid references traveller ON DELETE CASCADE,
                trip_id uuid references trip ON DELETE CASCADE,
                confirmed BOOLEAN NOT NULL DEFAULT FALSE, 
                admin BOOLEAN NOT NULL DEFAULT FALSE,
                PRIMARY KEY (traveller_id, trip_id)
        );
    """)


def downgrade():
    op.execute('DROP TABLE traveller_trip')
    op.execute('DROP TABLE trip')
    op.execute('DROP TABLE traveller')
