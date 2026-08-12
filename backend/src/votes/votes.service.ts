import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Vote from './entities/votes.entity';
import { VoteType } from './enums/vote-type.enum';
import Feedback from '../feedbacks/entities/feedback.entity';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
  ) {}

  async vote(userId: string, feedbackId: string, type: VoteType) {
    const feedback = await this.feedbackRepository.findOne({
      where: { id: feedbackId, isDeleted: false },
    });

    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }

    const existingVote = await this.voteRepository.findOne({
      where: { userId, feedbackId },
    });

    if (existingVote) {
      if (existingVote.type === type) {
        // Toggle behavior: remove vote if the same vote is clicked again
        await this.voteRepository.remove(existingVote);
      } else {
        // Switch vote type
        existingVote.type = type;
        await this.voteRepository.save(existingVote);
      }
    } else {
      // Create new vote
      const newVote = this.voteRepository.create({
        userId,
        feedbackId,
        type,
      });
      await this.voteRepository.save(newVote);
    }

    // Compute updated score and user vote
    const allVotes = await this.voteRepository.find({ where: { feedbackId } });
    const score = allVotes.reduce((acc, v) => {
      if (v.type === VoteType.UPVOTE) return acc + 1;
      if (v.type === VoteType.DOWNVOTE) return acc - 1;
      return acc;
    }, 0);

    const currentVote = await this.voteRepository.findOne({
      where: { userId, feedbackId },
    });
    const userVote = currentVote ? currentVote.type : null;

    return {
      userVote,
      score,
    };
  }
}
