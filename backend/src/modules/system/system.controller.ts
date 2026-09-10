import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../entities/user.entity';
import { DataDictService } from './services/data-dict.service';
import { MenuService } from './services/menu.service';
import { ListConfigService } from './services/list-config.service';
import { LanguageConfigService } from './services/language-config.service';
import { SystemConfigService } from './services/system-config.service';

@Controller('system')
@UseGuards(AuthGuard('jwt'))
export class SystemController {
  constructor(
    private dataDictService: DataDictService,
    private menuService: MenuService,
    private listConfigService: ListConfigService,
    private languageConfigService: LanguageConfigService,
    private systemConfigService: SystemConfigService,
  ) {}

  @Get('data-dict/categories')
  getDictCategories() {
    return this.dataDictService.getCategories();
  }

  @Get('data-dict/items')
  getDictItems(@Query('category') category?: string) {
    return this.dataDictService.getItemsByCategory(category);
  }

  @Post('data-dict')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  createDictItem(@Body() data: any) {
    return this.dataDictService.create(data);
  }

  @Patch('data-dict/:id')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  updateDictItem(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.dataDictService.update(id, data);
  }

  @Delete('data-dict/:id')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  deleteDictItem(@Param('id', ParseIntPipe) id: number) {
    return this.dataDictService.delete(id);
  }

  @Get('menu')
  getMenus() {
    return this.menuService.getMenuTree();
  }

  @Post('menu')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  createMenu(@Body() data: any) {
    return this.menuService.create(data);
  }

  @Patch('menu/:id')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  updateMenu(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.menuService.update(id, data);
  }

  @Delete('menu/:id')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  deleteMenu(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.delete(id);
  }

  @Patch('menu/:id/sort')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  sortMenu(@Param('id', ParseIntPipe) id: number, @Body('sortOrder') sortOrder: number) {
    return this.menuService.updateSort(id, sortOrder);
  }

  @Get('list-config/:type')
  getListConfig(@Param('type') type: string, @CurrentUser() user: any) {
    return this.listConfigService.getConfig(type, user.userId);
  }

  @Post('list-config')
  saveListConfig(@CurrentUser() user: any, @Body() data: any) {
    return this.listConfigService.saveConfig(user.userId, data);
  }

  @Get('language/:language')
  getLanguagePack(@Param('language') language: string) {
    return this.languageConfigService.getLanguagePack(language);
  }

  @Get('language')
  getAllLanguages() {
    return this.languageConfigService.getAllLanguages();
  }

  @Post('language')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  createLanguage(@Body() data: any) {
    return this.languageConfigService.createLanguage(data);
  }

  @Patch('language/:language/:key')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  updateLanguageItem(
    @Param('language') language: string,
    @Param('key') key: string,
    @Body('value') value: string,
  ) {
    return this.languageConfigService.updateItem(language, key, value);
  }

  @Post('language/export')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  exportLanguage(@Body('language') language: string) {
    return this.languageConfigService.exportLanguagePack(language);
  }

  @Post('language/import')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  importLanguage(@Body() data: { language: string; items: any[] }) {
    return this.languageConfigService.importLanguagePack(data.language, data.items);
  }

  @Get('config')
  getConfig() {
    return this.systemConfigService.getConfig();
  }

  @Patch('config')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  updateConfig(@Body() data: any) {
    return this.systemConfigService.updateConfig(data);
  }
}