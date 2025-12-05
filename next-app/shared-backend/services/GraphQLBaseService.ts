export class GraphQLBaseService {
  constructor(private apiBaseUrl: string) { }

  async graphql(query: string, variables?: any) {
    const res = await fetch(`${this.apiBaseUrl}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });
    return res.json();
  }
}