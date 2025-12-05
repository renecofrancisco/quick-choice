from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter
from schema.schema import schema

app = FastAPI()

# Allow requests from localhost:3000 (your Next.js frontend)
origins = [
    "http://localhost:3000",
    # you can add production URLs here later
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # <- allow frontend
    allow_credentials=True,
    allow_methods=["*"],            # GET, POST, OPTIONS
    allow_headers=["*"],            # Authorization, Content-Type, etc.
)

graphql_app = GraphQLRouter(schema)
app.include_router(graphql_app, prefix="/graphql")
