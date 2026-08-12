import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Tag from './entities/tag.entity';
import { In, Repository } from 'typeorm';
import { CreateTagDTO } from './dto/create.dto';
import User from '../users/entities/user.entity';
import { TagQueryDTO } from './dto/query.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async getTagList(tagsId: string[]): Promise<Tag[]> {
    return await this.tagRepository.find({ where: { id: In(tagsId) } });
  }

  async create(dto: CreateTagDTO, user: User): Promise<Tag> {
    const existingTag = await this.tagRepository.findOne({
      where: { name: dto.name.trim() },
    });
    if (existingTag) throw new ConflictException('Tag already exists');
    const tag = this.tagRepository.create({
      name: dto.name.trim(),
      createdBy: user,
    });
    return await this.tagRepository.save(tag);
  }

  async findAll(query: TagQueryDTO) {
    const { search, page = 1, limit = 20 } = query;
    const qb = this.tagRepository
      .createQueryBuilder('tag')
      .orderBy('tag.name', 'ASC');
    if (search) {
      qb.andWhere('tag.name ILIKE :search', { search: `%${search}%` });
    }
    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  async findByIds(ids: string[]) {
    return this.tagRepository
      .createQueryBuilder('tag')
      .where('tag.id IN (:...ids)', { ids })
      .getMany();
  }
}
