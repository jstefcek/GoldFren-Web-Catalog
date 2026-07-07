# MySQL database connection and utility functions
# Provides a SQLAlchemy engine and a MySQLdb connection wrapper with dictionary cursors.

# Libraries
import os
from contextlib import contextmanager
import MySQLdb.cursors
from sqlalchemy import create_engine
from sqlalchemy.engine import URL

_ENGINE = None

# Utility function to get an integer environment variable with a default value
def _env_int(name: str, default: int) -> int:
    try:
        return int(os.getenv(name, default))
    except (TypeError, ValueError):
        return default

# Function to get a SQLAlchemy engine, creating it if it doesn't exist
def _get_engine():
    global _ENGINE

    if _ENGINE is None:
        url = URL.create(
            "mysql+mysqldb",
            username=os.getenv("MYSQL_USER"),
            password=os.getenv("MYSQL_PASSWORD"),
            host=os.getenv("MYSQL_HOSTNAME"),
            port=_env_int("MYSQL_PORT", 3306),
            database=os.getenv("MYSQL_NAME"),
        )
        _ENGINE = create_engine(
            url,
            pool_size=_env_int("MYSQL_POOL_SIZE", 5),
            max_overflow=_env_int("MYSQL_MAX_OVERFLOW", 10),
            pool_recycle=_env_int("MYSQL_POOL_RECYCLE", 1800),
            pool_pre_ping=True,
            connect_args={
                "charset": "utf8mb4",
            },
        )

    return _ENGINE

# Class to wrap a MySQLdb connection and provide dictionary cursors
class DictCursorConnection:
    def __init__(self, conn):
        self._conn = conn

    def __getattr__(self, name):
        return getattr(self._conn, name)

    def cursor(self, *args, **kwargs):
        if not args and "cursorclass" not in kwargs:
            kwargs["cursorclass"] = MySQLdb.cursors.DictCursor
        return self._conn.cursor(*args, **kwargs)

    def close(self):
        self._conn.close()

# Function to connect to the MySQL database and return a DictCursorConnection
def connect():
    try:
        return DictCursorConnection(_get_engine().raw_connection())
    except Exception as ex:
        print(repr(ex))
        return None

# Context manager to provide a MySQL connection with optional commit/rollback behavior
@contextmanager
def connection(commit: bool = False):
    conn = connect()
    if conn is None:
        yield None
        return

    try:
        yield conn
        if commit:
            conn.commit()
    except Exception:
        if commit:
            conn.rollback()
        raise
    finally:
        conn.close()
