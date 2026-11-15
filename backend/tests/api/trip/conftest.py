from datetime import date

import pytest_asyncio


@pytest_asyncio.fixture
async def seeded_trip(db):
    return await db.create_trip('Kyoto', 'Spring', date(2026, 4, 1), date(2026, 4, 8), 'city', 'troy@test.com')
