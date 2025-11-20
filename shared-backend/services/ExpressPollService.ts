// shared-backend/services/ExpressPollService.ts
import { IPollService } from "../interfaces/IPollService";
import { IPoll } from "../models/IPoll";

export class ExpressPollService implements IPollService {
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl; // e.g. "https://my-express-api.com"
  }

  async getUserPolls(userId: string): Promise<IPoll[]> {
    const res = await fetch(`${this.baseUrl}/polls?userId=${userId}`);
    if (!res.ok) throw new Error("Failed to fetch user polls from Express API");
    const data = await res.json();
    return data as IPoll[];
  }

  async getPollById(pollId: string): Promise<IPoll | null> {
    const res = await fetch(`${this.baseUrl}/polls/${pollId}`);
    if (!res.ok) throw new Error("Failed to fetch poll from Express API");
    const data = await res.json();
    return data || null;
  }

  async createPoll(userId: string, optionA: string, optionB: string): Promise<string> {
    const res = await fetch(`${this.baseUrl}/polls`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, optionA, optionB }),
    });
    if (!res.ok) throw new Error("Failed to create poll via Express API");
    const data = await res.json();
    return data.pollId as string; // return new poll id
  }
}
