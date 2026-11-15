from app.db.seed import seed_demo_farm_if_empty
from app.modules.farm_management.models import Farm, CropHistoryEntryModel

def test_seed_demo_farm_empty_and_idempotent(db_session):
    # Ensure empty
    db_session.query(CropHistoryEntryModel).delete()
    db_session.query(Farm).delete()
    db_session.commit()
    assert db_session.query(Farm).count() == 0

    # First seed
    seeded = seed_demo_farm_if_empty(db_session)
    assert seeded is True
    assert db_session.query(Farm).count() == 1

    demo_farm = db_session.query(Farm).filter_by(farm_id="demo-peshawar-001").first()
    assert demo_farm is not None
    assert demo_farm.name == "[DEMO] Peshawar Valley Demo Farm"
    assert demo_farm.latitude == 34.0151
    assert demo_farm.longitude == 71.5249
    assert demo_farm.area_value == 5.0
    assert demo_farm.area_unit == "acres"
    assert demo_farm.soil_type == "loamy"
    assert demo_farm.irrigation_type == "tube_well"
    assert demo_farm.water_availability == "medium"
    assert demo_farm.is_demo_data is True
    assert len(demo_farm.crop_history) == 2

    # Second seed attempt must return False and not duplicate
    seeded_again = seed_demo_farm_if_empty(db_session)
    assert seeded_again is False
    assert db_session.query(Farm).count() == 1
