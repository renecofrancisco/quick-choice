// src/app/polls/page.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IPoll } from '../../../shared-backend';
import { ServiceContext } from '../services/service-context';
import { AuthState } from '../utils/auth-state';

@Component({
  selector: 'app-polls',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './polls.html',
  styleUrl: './polls.css',
})
export class PollsPage implements OnInit {
  polls: IPoll[] = [];
  message = '';
  optionA = '';
  optionB = '';
  userId: string | null = null;

  showCreateModal = false;
  showResultModal = false;
  selectedPoll: IPoll | null = null;

  COLORS = ['#4f46e5', '#16a34a', '#facc15'];

  pollService;
  voteService;

  constructor(serviceContext: ServiceContext, private authState: AuthState, private cd: ChangeDetectorRef) {
    this.pollService = serviceContext.value.pollService;
    this.voteService = serviceContext.value.voteService;
  }

  ngOnInit(): void {
    (async () => {
      const user = this.authState.user;
      if (!user) return;
      this.userId = user.id;
      await this.fetchPolls(user.id);
    })();
  }

  async fetchPolls(uid: string) {
    try {
      const data = await this.pollService.getUserPolls(uid);
      if (!data || data.length === 0) {
        this.message = "You haven't created any polls yet.";
        this.polls = [];
      } else {
        this.message = '';
        this.polls = data;
      }
    } catch (err) {
      console.error(err);
      this.message = 'Error fetching your polls.';
    } finally {
      this.cd.detectChanges();
    }
  }

  async fetchPollById(pollId: string): Promise<IPoll | null> {
    if (!this.userId) return null;
    try {
      const latestPoll = await this.pollService.getPollById(pollId);
      if (!latestPoll) return null;
      this.polls = this.polls.map(p =>
        p.poll_id === pollId ? latestPoll : p
      );
      return latestPoll;
    } catch (err) {
      console.error('Error fetching poll:', err);
      return null;
    }
  }

  async handleCreate() {
    if (!this.userId) return;
    try {
      const newPollId = await this.pollService.createPoll(
        this.userId,
        this.optionA,
        this.optionB
      );
      this.optionA = '';
      this.optionB = '';
      this.showCreateModal = false;
      await this.fetchPolls(this.userId);
      await this.voteService.triggerFakeVotes(newPollId);
    } catch (err) {
      console.error(err);
      this.message = 'Error creating poll.';
    }
  }

  async openResultModal(poll: IPoll) {
    const latestPoll = await this.fetchPollById(poll.poll_id);
    this.selectedPoll = latestPoll || poll;
    this.showResultModal = true;
  }

  closeResultModal() {
    this.showResultModal = false;
    this.selectedPoll = null;
  }

  getWinner(): string {
    if (!this.selectedPoll) return '';
    return this.selectedPoll.votes_a >= this.selectedPoll.votes_b
      ? this.selectedPoll.option_a
      : this.selectedPoll.option_b;
  }

  getWinnerPercent(): number {
    if (!this.selectedPoll) return 0;
    const a = this.selectedPoll.votes_a;
    const b = this.selectedPoll.votes_b;
    const total = a + b || 1; // prevent division by zero
    return this.getWinner() === this.selectedPoll.option_a
      ? (a / total) * 100
      : (b / total) * 100;
  }

  getPercentA(): number {
    if (!this.selectedPoll) return 0;
    const total = this.selectedPoll.votes_a + this.selectedPoll.votes_b || 1;
    return (this.selectedPoll.votes_a / total) * 100;
  }

  getPercentB(): number {
    if (!this.selectedPoll) return 0;
    const total = this.selectedPoll.votes_a + this.selectedPoll.votes_b || 1;
    return (this.selectedPoll.votes_b / total) * 100;
  }
}
