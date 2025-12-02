import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPoll } from '../../../shared-backend';
import { ServiceContext } from '../services/service-context';

@Component({
  selector: 'app-vote',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vote.html',
  styleUrl: './vote.css',
})
export class VotePage implements OnInit {
  poll: IPoll | null = null;
  message = '';

  authService;
  voteService;

  constructor(serviceContext: ServiceContext) {
    this.authService = serviceContext.value.authService;
    this.voteService = serviceContext.value.voteService;
  }

  async ngOnInit() {
    await this.fetchNextPoll();
  }

  async fetchNextPoll() {
    try {
      const user = await this.authService.getUser();
      if (!user) return;

      const nextPoll = await this.voteService.getNextPoll(user.id);
      if (!nextPoll) {
        this.poll = null;
        this.message = 'No more polls available.';
      } else {
        this.poll = nextPoll;
        this.message = '';
      }
    } catch (err) {
      console.error(err);
      this.message = 'Error loading poll.';
    }
  }

  async vote(choice: 'A' | 'B' | 'skip') {
    const user = await this.authService.getUser();
    if (!user || !this.poll) return;

    try {
      await this.voteService.vote(user.id, this.poll.poll_id, choice);
      await this.fetchNextPoll();
    } catch (err) {
      console.error(err);
      this.message = 'Error submitting vote.';
    }
  }
}
