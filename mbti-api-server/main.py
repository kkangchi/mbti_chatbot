from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS 설정 (React와의 연결을 위해 필요)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 공통 POST 핸들러 생성 함수
def create_mbti_post_handler(type_name):
    async def handler(request: Request):
        data = await request.json()
        user_message = data.get("message", "")
        return {
            "reply": f"{type_name} 상담가입니다. '{user_message}'에 대해 조언드릴게요."
        }
    return handler

# MBTI 목록
mbti_types = [
    "istj", "isfj", "infj", "intj",
    "istp", "isfp", "infp", "intp",
    "estp", "esfp", "enfp", "entp",
    "estj", "esfj", "enfj", "entj"
]

# 각 MBTI에 대해 GET, POST 라우터 생성
for mbti in mbti_types:
    get_path = f"/api/{mbti}"
    post_path = f"/api/{mbti}"

    @app.get(get_path)
    async def get_reply(mbti=mbti.upper()):
        return {"reply": f"안녕하세요, {mbti} 상담가입니다. 무엇이 고민이신가요?"}

    app.post(post_path)(create_mbti_post_handler(mbti.upper()))
