import {
  Controller, Get, Post, Patch, Param, Body, Query,
  UseGuards, ParseIntPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../entities/user.entity';
import { BorrowService } from './borrow.service';
import { MembersService } from '../members/members.service';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { BorrowQueryDto } from './dto/borrow-query.dto';

@Controller('borrow')
@UseGuards(AuthGuard('jwt'))
export class BorrowController {
  constructor(
    private readonly borrowService: BorrowService,
    private readonly membersService: MembersService,
  ) {}

  @Post()
  create(
    @CurrentUser() user: any,
    @Body() createBorrowDto: CreateBorrowDto,
  ) {
    return this.borrowService.create(user.userId, createBorrowDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  findAll(@Query() query: BorrowQueryDto) {
    return this.borrowService.findAll(query);
  }

  @Get('my')
  async getMyBorrows(@CurrentUser() user: any) {
    const member = await this.membersService.findByUserId(user.userId);
    return this.borrowService.findByMember(member.id);
  }

  @Get('overdue')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  getOverdueList() {
    return this.borrowService.findAll({ status: 'overdue' } as any);
  }

  @Get(':id/calculate-overdue')
  calculateOverdue(@Param('id', ParseIntPipe) id: number) {
    return this.borrowService.calculateOverdue(id);
  }

  @Patch(':id/return')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  async returnBook(
    @CurrentUser() user: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const member = await this.membersService.findByUserId(user.userId);
    return this.borrowService.returnBook(member.id, id);
  }

  @Patch(':id/renew')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  async renew(
    @CurrentUser() user: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const member = await this.membersService.findByUserId(user.userId);
    return this.borrowService.renew(member.id, id);
  }
}