from contextlib import contextmanager

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict
from sqlalchemy import Boolean, Column, Integer, String, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# DB 설정
DATABASE_URL = "sqlite:///./todos.db"
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


# Pydantic 스키마 (요청/응답 데이터 구조 정의)
class TodoCreate(BaseModel):
    text: str


class TodoUpdate(BaseModel):
    text: str
    is_completed: bool


class TodoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    text: str
    is_completed: bool


# 테이블 생성
Base.metadata.create_all(bind=engine)

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
def get_todos(db=Depends(get_db)):
    return db.query(Todo).order_by(Todo.id.desc()).all()


@app.post("/todos", response_model=TodoResponse, status_code=201)
def create_todo(payload: TodoCreate, db=Depends(get_db)):
    text = payload.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Todo text is required.")

    todo = Todo(text=text, is_completed=False)
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
