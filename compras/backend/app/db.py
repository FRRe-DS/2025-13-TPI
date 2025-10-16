from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Engine por defecto: SQLite local (archivo: app.db.sqlite)
DATABASE_URL = "sqlite:///./app.db.sqlite"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
