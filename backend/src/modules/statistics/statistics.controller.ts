import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
@UseGuards(AuthGuard('jwt'))
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('dashboard')
  getDashboardStats() {
    return this.statisticsService.getDashboardStats();
  }
}
