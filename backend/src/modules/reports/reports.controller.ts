import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('borrow-stats')
  getBorrowStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getBorrowStats(startDate, endDate);
  }

  @Get('hot-books')
  getHotBooks(@Query('limit') limit?: number) {
    return this.reportsService.getHotBooks(limit || 20);
  }

  @Get('member-activity')
  getMemberActivity(@Query('limit') limit?: number) {
    return this.reportsService.getMemberActivity(limit || 20);
  }

  @Get('category-distribution')
  getCategoryDistribution() {
    return this.reportsService.getCategoryDistribution();
  }
}