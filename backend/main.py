import os
from typing import Optional

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict
from sqlalchemy import Boolean, Column, Integer, String, create_engine
from sqlalchemy import text as sql_text
from sqlalchemy.orm import declarative_base, sessionmaker

# DB 설정
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todos.db")
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# DB 모델 (테이블 구조 정의)
class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    is_completed = Column(Boolean, default=False, nullable=False)
    date_key = Column(String, nullable=False, default="2026-06-14")


# Pydantic 스키마 (요청/응답 데이터 구조 정의)
class TodoCreate(BaseModel):
    text: str
    date_key: str


class TodoUpdate(BaseModel):
    text: str
    is_completed: bool
    date_key: Optional[str] = None


class TodoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    text: str
    is_completed: bool
    date_key: str


# 테이블 생성
Base.metadata.create_all(bind=engine)


def ensure_date_key_column():
    with engine.connect() as connection:
        columns = connection.execute(sql_text("PRAGMA table_info(todos);")).fetchall()
        column_names = {column[1] for column in columns}
        if "date_key" not in column_names:
            connection.execute(
                sql_text("ALTER TABLE todos ADD COLUMN date_key VARCHAR NOT NULL DEFAULT '2026-06-14'")
            )
            connection.commit()


ensure_date_key_column()

# FastAPI 앱 생성
app = FastAPI(title="Todo API")

# FastAPI 앱 미들웨어 및 CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# DB 세션 의존성
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 엔드포인트 구현
@app.get("/todos", response_model=list[TodoResponse])
def get_todos(date_key: Optional[str] = None, db=Depends(get_db)):
    query = db.query(Todo)
    if date_key:
        query = query.filter(Todo.date_key == date_key)
    return query.order_by(Todo.id.desc()).all()


@app.post("/todos", response_model=TodoResponse, status_code=201)
def create_todo(payload: TodoCreate, db=Depends(get_db)):
    text = payload.text.strip()
    date_key = payload.date_key.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Todo text is required.")
    if not date_key:
        raise HTTPException(status_code=400, detail="Todo date is required.")

    todo = Todo(text=text, is_completed=False, date_key=date_key)
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return todo


@app.put("/todos/{todo_id}", response_model=TodoResponse)
def update_todo(todo_id: int, payload: TodoUpdate, db=Depends(get_db)):
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found.")

    text = payload.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Todo text is required.")

    todo.text = text
    todo.is_completed = payload.is_completed
    if payload.date_key is not None:
        date_key = payload.date_key.strip()
        if date_key:
            todo.date_key = date_key
    db.commit()
    db.refresh(todo)
    return todo


@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int, db=Depends(get_db)):
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found.")

    db.delete(todo)
    db.commit()
    return {"message": "Todo deleted successfully."}


@app.get("/health")
def health_check():
    return {"status": "ok"}
