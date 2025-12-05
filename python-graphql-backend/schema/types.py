import strawberry
from typing import Optional

@strawberry.type
class User:
    id: str
    email: str

@strawberry.type
class AuthTokens:
    access_token: str
    refresh_token: Optional[str] = None  # only if you want refresh

@strawberry.type
class TokensPayload:
    access_token: str
    refresh_token: str
    user: User

@strawberry.type
class Poll:
    poll_id: str
    option_a: str
    option_b: str
    votes_a: int
    votes_b: int
    votes_skip: int

@strawberry.type
class UserProfile:
    user_id: str
    credits: int
    created_at: Optional[str]

