import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LanguageConfig } from '../../../entities/language-config.entity';

@Injectable()
export class LanguageConfigService {
  constructor(
    @InjectRepository(LanguageConfig)
    private languageConfigRepository: Repository<LanguageConfig>,
  ) {}

  async getLanguagePack(language: string): Promise<Record<string, string>> {
    const items = await this.languageConfigRepository.find({
      where: { language },
    });

    const pack: Record<string, string> = {};
    items.forEach(item => {
      pack[item.key] = item.value;
    });
    return pack;
  }

  async getAllLanguages(): Promise<string[]> {
    const result = await this.languageConfigRepository
      .createQueryBuilder('lc')
      .select('DISTINCT lc.language', 'language')
      .getRawMany();
    return result.map(r => r.language);
  }

  async createLanguage(data: { language: string; name: string }): Promise<void> {
    const defaultItems = this.getDefaultStrings(data.language);
    for (const [key, value] of Object.entries(defaultItems)) {
      const item = this.languageConfigRepository.create({
        language: data.language,
        module: 'common',
        key,
        value,
      });
      await this.languageConfigRepository.save(item);
    }
  }

  async updateItem(language: string, key: string, value: string): Promise<LanguageConfig> {
    let item = await this.languageConfigRepository.findOne({
      where: { language, key },
    });

    if (item) {
      item.value = value;
    } else {
      item = this.languageConfigRepository.create({ language, module: 'common', key, value });
    }

    return this.languageConfigRepository.save(item);
  }

  async exportLanguagePack(language: string): Promise<any[]> {
    const items = await this.languageConfigRepository.find({ where: { language } });
    return items.map(item => ({ key: item.key, value: item.value }));
  }

  async importLanguagePack(language: string, items: any[]): Promise<void> {
    for (const item of items) {
      await this.updateItem(language, item.key, item.value);
    }
  }

  private getDefaultStrings(language: string): Record<string, string> {
    if (language === 'en-US') {
      return {
        'common.login': 'Login',
        'common.logout': 'Logout',
        'common.save': 'Save',
        'common.cancel': 'Cancel',
        'common.delete': 'Delete',
        'common.edit': 'Edit',
        'common.add': 'Add',
        'menu.home': 'Home',
        'menu.books': 'Books',
        'menu.members': 'Members',
        'menu.borrow': 'Borrow',
        'menu.reservation': 'Reservations',
        'menu.settings': 'Settings',
      };
    }
    return {
      'common.login': '登录',
      'common.logout': '退出登录',
      'common.save': '保存',
      'common.cancel': '取消',
      'common.delete': '删除',
      'common.edit': '编辑',
      'common.add': '添加',
      'menu.home': '首页',
      'menu.books': '图书管理',
      'menu.members': '会员管理',
      'menu.borrow': '借阅管理',
      'menu.reservation': '预约管理',
      'menu.settings': '系统设置',
    };
  }
}