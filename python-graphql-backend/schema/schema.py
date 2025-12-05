import strawberry
from .auth import AuthQueries, AuthMutations
from .polls import PollQueries, PollMutations
from .vote import VoteQueries, VoteMutations
from .profile import ProfileQueries
from strawberry.schema.config import StrawberryConfig

@strawberry.type
class Query(AuthQueries, PollQueries, VoteQueries, ProfileQueries):
    pass

@strawberry.type
class Mutation(AuthMutations, PollMutations, VoteMutations):
    pass

schema = strawberry.Schema(query=Query, mutation=Mutation, config=StrawberryConfig(auto_camel_case=False))
