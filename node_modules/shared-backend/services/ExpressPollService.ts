// shared-backend/services/ExpressPollService.ts
import { IPollService } from "../interfaces/IPollService";
import { IPoll } from "../models/IPoll";

export class ExpressPollService implements IPollService {
  constructor(private expressApiUrl: string) { }
  private baseUrl = `${this.expressApiUrl!}/polls`;

  async getUserPolls(userId: string): Promise<IPoll[]> {
    const res = await fetch(`${this.baseUrl}?userId=${userId}`);
    if (!res.ok) throw new Error("Failed to fetch user polls from Express API");
    const data = await res.json();
    return data as IPoll[];
  }

  async getPollById(pollId: string): Promise<IPoll | null> {
    const res = await fetch(`${this.baseUrl}/${pollId}`);
    if (!res.ok) throw new Error("Failed to fetch poll from Express API");
    const data = await res.json();
    console.log("Fetched poll data:", data);
    return data || null;
  }

  async createPoll(userId: string, optionA: string, optionB: string): Promise<string> {
    const res = await fetch(`${this.baseUrl}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, optionA, optionB }),
    });
    if (!res.ok) throw new Error("Failed to create poll via Express API");
    const data = await res.json();
    console.log("Created poll response data:", data);
    return data.pollId as string; // return new poll id
  }
}
