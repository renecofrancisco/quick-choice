import strawberry
from typing import Optional
from lib.supabase_client import supabase
import httpx
import os
import asyncio

@strawberry.type
class VoteQueries:
    @strawberry.field
    def get_next_poll_for_vote(self, user_id: str) -> Optional[str]:
        """Optional: replicate Express GET /polls/next for voting"""
        result = supabase.rpc("get_next_poll", {"p_user_id": user_id}).execute()
        data = result.data
        if not data:
            return None
        return str(data[0]["poll_id"])


@strawberry.type
class VoteMutations:
    @strawberry.mutation
    def submit_vote(self, user_id: str, poll_id: str, choice: str) -> bool:
        """Equivalent of POST /votes"""
        if not (user_id and poll_id and choice):
            raise ValueError("Missing fields")

        # Insert vote
        vote_result = supabase.from_("votes").insert({
            "user_id": user_id,
            "poll_id": poll_id,
            "choice": choice
        }).execute()

        # Change credits
        credit_result = supabase.rpc("change_credits", {
            "user_uuid": user_id,
            "change": 1
        }).execute()

        return True

    @strawberry.mutation
    async def trigger_fake_votes(self, poll_id: str) -> bool:
        """Fire-and-forget trigger for fake votes"""
        url = os.environ.get("FAKE_VOTES_FUNCTION_URL")
        if not url:
            print("FAKE_VOTES_FUNCTION_URL is not set")
            return False

        async def fire_and_forget():
            try:
                async with httpx.AsyncClient(timeout=1.0) as client:
                    await client.post(url, json={"pollId": poll_id})
            except Exception as e:
                print("Error sending fake votes request:", e)

        # Schedule in the background, don’t await
        asyncio.create_task(fire_and_forget())

        # Return immediately
        return True
