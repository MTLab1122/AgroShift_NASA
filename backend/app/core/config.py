from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    PORT: int = 8000
    DATABASE_URL: str = "sqlite:///./agroshift.db"
    
    NASA_POWER_API_BASE_URL: str = "https://power.larc.nasa.gov/api/temporal/daily/point"
    NASA_POWER_TIMEOUT_SECONDS: float = 15.0
    
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    
    # Path configurations
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    ROOT_DIR: Path = BASE_DIR.parent
    DATA_DIR: Path = ROOT_DIR / "data"
    DEMO_DATA_DIR: Path = DATA_DIR / "demo"
    CROP_CATALOG_PATH: Path = DATA_DIR / "crop-catalog" / "peshawar_valley_crops.json"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
