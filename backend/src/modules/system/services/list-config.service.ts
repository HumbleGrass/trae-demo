import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListConfig } from '../../../entities/list-config.entity';

@Injectable()
export class ListConfigService {
  constructor(
    @InjectRepository(ListConfig)
    private listConfigRepository: Repository<ListConfig>,
  ) {}

  async getConfig(type: string, userId: number): Promise<ListConfig> {
    let config = await this.listConfigRepository.findOne({
      where: { type, userId },
    });

    if (!config) {
      config = this.listConfigRepository.create({
        type,
        name: 'default',
        userId,
        config: { columns: [] },
      });
      await this.listConfigRepository.save(config);
    }

    return config;
  }

  async saveConfig(userId: number, data: { type: string; config: any }): Promise<ListConfig> {
    let config = await this.listConfigRepository.findOne({
      where: { type: data.type, userId },
    });

    if (config) {
      config.config = data.config;
      return this.listConfigRepository.save(config);
    }

    config = this.listConfigRepository.create({
      type: data.type,
      name: 'custom',
      userId,
      config: data.config,
    });
    return this.listConfigRepository.save(config);
  }
}