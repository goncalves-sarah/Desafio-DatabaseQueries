import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return await this.repository
      .createQueryBuilder("g")
      .where("g.title ilike :title", { title:`%${param}%` })
      .getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return await this.repository.query(
      `SELECT COUNT(*) FROM GAMES`
    )
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const users =  await this.repository
      .createQueryBuilder("g")
      .where("g.id = :id", { id: id })
      .relation(Game,"users")
      .of(id)
      .loadMany();
    console.log(users);
    return users;
  }
}
