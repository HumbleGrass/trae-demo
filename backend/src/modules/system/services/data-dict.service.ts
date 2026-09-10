import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataDict } from '../../../entities/data-dict.entity';

@Injectable()
export class DataDictService {
  constructor(
    @InjectRepository(DataDict)
    private dataDictRepository: Repository<DataDict>,
  ) {}

  async getCategories(): Promise<string[]> {
    const result = await this.dataDictRepository
      .createQueryBuilder('dict')
      .select('DISTINCT dict.category', 'category')
      .getRawMany();
    return result.map(r => r.category);
  }

  async getItemsByCategory(category?: string): Promise<DataDict[]> {
    const where: any = {};
    if (category) {
      where.category = category;
    }
    return this.dataDictRepository.find({
      where,
      order: { sortOrder: 'ASC' },
    });
  }

  async create(data: Partial<DataDict>): Promise<DataDict> {
    const item = this.dataDictRepository.create(data);
    return this.dataDictRepository.save(item);
  }

  async update(id: number, data: Partial<DataDict>): Promise<DataDict> {
    const item = await this.dataDictRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException('字典项不存在');
    }
    Object.assign(item, data);
    return this.dataDictRepository.save(item);
  }

  async delete(id: number): Promise<void> {
    await this.dataDictRepository.delete(id);
  }
}