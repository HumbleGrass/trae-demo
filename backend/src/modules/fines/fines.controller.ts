import { 
  Controller, Get, Post, Patch, Param, Body, Query, 
  UseGuards, ParseIntPipe 
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../entities/user.entity';
import { FinesService } from './fines.service';
import { MembersService } from '../members/members.service';
import { FineQueryDto } from './dto/fine-query.dto';

@Controller('fines')
@UseGuards(AuthGuard('jwt'))
export class FinesController {
  constructor(
    private readonly finesService: FinesService,
    private readonly membersService: MembersService,
  ) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  findAll(@Query() query: FineQueryDto) {
    return this.finesService.findAll(query);
  }

  @Get('my')
  async getMyFines(@CurrentUser() user: any) {
    const member = await this.membersService.findByUserId(user.userId);
    return this.finesService.findByMember(member.id);
  }

  @Get('my/unpaid-total')
  async getMyUnpaidTotal(@CurrentUser() user: any) {
    const member = await this.membersService.findByUserId(user.userId);
    return this.finesService.getUnpaidTotal(member.id);
  }

  @Patch(':id/pay')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  pay(@Param('id', ParseIntPipe) id: number) {
    return this.finesService.pay(id);
  }
}