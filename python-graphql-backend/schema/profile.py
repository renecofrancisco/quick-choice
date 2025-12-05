import strawberry
from typing import Optional
from .types import UserProfile
from lib.supabase_client import supabase  # your initialized Supabase client

@strawberry.type
class ProfileQueries:
    @strawberry.field
    def get_user_profile(self, user_id: str) -> Optional[UserProfile]:
        """Equivalent of GET /profiles/:userId"""
        result = supabase.from_("user_profiles").select("*").eq("user_id", user_id).single().execute()
        
        if not result.data:
            return None

        return UserProfile(**result.data)
