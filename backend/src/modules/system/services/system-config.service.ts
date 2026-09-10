import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemConfig } from '../../../entities/system-config.entity';

@Injectable()
export class SystemConfigService {
  constructor(
    @InjectRepository(SystemConfig)
    private configRepository: Repository<SystemConfig>,
  ) {}

  async getConfig(): Promise<SystemConfig> {
    let config = await this.configRepository.findOne({ where: {} });
    if (!config) {
      config = this.configRepository.create({
        systemName: '图书馆管理系统',
        maxBorrow: 5,
        borrowDays: 30,
        reserveExpireHours: 72,
        finePerDay: 0.5,
        maxRenewCount: 1,
      });
      await this.configRepository.save(config);
    }
    return config;
  }

  async updateConfig(data: Partial<SystemConfig>): Promise<SystemConfig> {
    let config = await this.getConfig();
    Object.assign(config, data);
    return this.configRepository.save(config);
  }
}
