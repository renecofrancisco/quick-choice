import strawberry
from .types import User, TokensPayload
from lib.supabase_client import supabase  # <-- shared client
from typing import Optional

@strawberry.input
class UserInput:
    id: str
    email: str

@strawberry.type
class AuthMutations:

    @strawberry.mutation
    async def sendMagicLink(self, email: str, redirectUrl: str) -> bool:
        if not email or not redirectUrl:
            return False
        try:
            result = supabase.auth.sign_in_with_otp(
                {
                    "email": email,
                    "options": {
                        "email_redirect_to": redirectUrl,
                    },
                }
            )
            return result.user is not None
        except Exception as e:
            print(e)
            return False

    @strawberry.mutation
    async def signOut(self) -> bool:
        return True

    @strawberry.mutation
    async def consumeMagicLink(
        self,
        access_token: str,
        refresh_token: str,
        user: UserInput
    ) -> TokensPayload:
        return TokensPayload(
            access_token=access_token,
            refresh_token=refresh_token,
            user=user
        )
    
@strawberry.type
class AuthQueries:

    @strawberry.field
    async def me(self, token: str) -> Optional[User]:
        if not token:
            return None
        try:
            user_resp = supabase.auth.get_user(token)
            if not user_resp.user:
                print("No User found")
                return None
            user = user_resp.user
            return User(id=user.id, email=user.email)
        except Exception as e:
            print(e)
            return None