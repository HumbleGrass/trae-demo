import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemController } from './system.controller';
import { DataDictService } from './services/data-dict.service';
import { MenuService } from './services/menu.service';
import { ListConfigService } from './services/list-config.service';
import { LanguageConfigService } from './services/language-config.service';
import { SystemConfigService } from './services/system-config.service';
import { DataDict } from '../../entities/data-dict.entity';
import { SystemMenu } from '../../entities/system-menu.entity';
import { ListConfig } from '../../entities/list-config.entity';
import { LanguageConfig } from '../../entities/language-config.entity';
import { UserPreferences } from '../../entities/user-preferences.entity';
import { SystemConfig } from '../../entities/system-config.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DataDict, SystemMenu, ListConfig, LanguageConfig, UserPreferences, SystemConfig]),
  ],
  controllers: [SystemController],
  providers: [
    DataDictService,
    MenuService,
    ListConfigService,
    LanguageConfigService,
    SystemConfigService,
  ],
  exports: [
    DataDictService,
    MenuService,
    ListConfigService,
    LanguageConfigService,
    SystemConfigService,
  ],
})
export class SystemModule {}