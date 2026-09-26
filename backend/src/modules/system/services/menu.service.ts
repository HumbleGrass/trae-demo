import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemMenu } from '../../../entities/system-menu.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(SystemMenu)
    private menuRepository: Repository<SystemMenu>,
  ) {}

  async getMenuTree(): Promise<SystemMenu[]> {
    return this.menuRepository.find({
      order: { sortOrder: 'ASC' },
    });
  }

  async create(data: Partial<SystemMenu>): Promise<SystemMenu> {
    const menu = this.menuRepository.create(data);
    return this.menuRepository.save(menu);
  }

  async update(id: number, data: Partial<SystemMenu>): Promise<SystemMenu> {
    const menu = await this.menuRepository.findOne({ where: { id } });
    if (!menu) {
      throw new NotFoundException('菜单不存在');
    }
    Object.assign(menu, data);
    return this.menuRepository.save(menu);
  }

  async delete(id: number): Promise<void> {
    await this.menuRepository.delete(id);
  }

  async updateSort(id: number, sortOrder: number): Promise<SystemMenu> {
    const menu = await this.menuRepository.findOne({ where: { id } });
    if (!menu) {
      throw new NotFoundException('菜单不存在');
    }
    menu.sortOrder = sortOrder;
    return this.menuRepository.save(menu);
  }
}