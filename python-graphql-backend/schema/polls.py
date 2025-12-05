import strawberry
from typing import List
from .types import Poll
from lib.supabase_client import supabase  # your initialized Supabase client

@strawberry.type
class PollQueries:
    @strawberry.field
    def get_next_poll(self, user_id: str) -> Poll | None:
        """Equivalent of GET /polls/next?userId=..."""
        result = supabase.rpc("get_next_poll", {"p_user_id": user_id}).execute()
        data = result.data
        if not data:
            return None
        return Poll(**data[0])

    @strawberry.field
    def get_user_polls(self, user_id: str) -> List[Poll]:
        """Equivalent of GET /polls?userId=..."""
        result = supabase.rpc("get_user_polls", {"p_user_id": user_id}).execute()
        return [Poll(**p) for p in (result.data or [])]

    @strawberry.field
    def get_poll_by_id(self, poll_id: str) -> Poll | None:
        """Equivalent of GET /polls/:pollId"""
        result = supabase.rpc("get_poll_by_id", {"p_poll_id": poll_id}).execute()
        data = result.data
        if not data:
            return None
        return Poll(**data[0])

@strawberry.type
class PollMutations:
    @strawberry.mutation
    def create_poll(self, user_id: str, option_a: str, option_b: str) -> str:
        """Equivalent of POST /polls"""
        result = supabase.rpc(
            "create_poll",
            {
                "p_user_id": user_id,
                "p_option_a": option_a,
                "p_option_b": option_b,
            },
        ).execute()

        if not result.data:
            raise Exception("Failed to create poll")

        # Return pollId
        return str(result.data)
