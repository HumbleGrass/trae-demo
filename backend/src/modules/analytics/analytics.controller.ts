import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../entities/user.entity';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
@UseGuards(AuthGuard('jwt'))
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('recommendations')
  getRecommendations(
    @CurrentUser() user: any,
    @Query('limit') limit?: number,
  ) {
    return this.analyticsService.getRecommendations(user.userId, limit || 10);
  }

  @Get('borrow-trend')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  getBorrowTrend(@Query('months') months?: number) {
    return this.analyticsService.getBorrowTrend(months || 6);
  }

  @Get('reader-demographics')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  getReaderDemographics() {
    return this.analyticsService.getReaderDemographics();
  }

  @Get('book-rankings')
  getBookRankings() {
    return this.analyticsService.getBookRankings();
  }

  @Get('member-growth')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  getMemberGrowth(@Query('months') months?: number) {
    return this.analyticsService.getMemberGrowth(months || 6);
  }
}