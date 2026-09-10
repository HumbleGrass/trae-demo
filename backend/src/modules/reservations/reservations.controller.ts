import { 
  Controller, Get, Post, Patch, Param, Body, 
  UseGuards, ParseIntPipe, Query 
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../entities/user.entity';
import { ReservationsService } from './reservations.service';
import { MembersService } from '../members/members.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Controller('reservations')
@UseGuards(AuthGuard('jwt'))
export class ReservationsController {
  constructor(
    private readonly reservationsService: ReservationsService,
    private readonly membersService: MembersService,
  ) {}

  @Post()
  async create(
    @CurrentUser() user: any,
    @Body() createReservationDto: CreateReservationDto,
  ) {
    const member = await this.membersService.findByUserId(user.userId);
    return this.reservationsService.create(member.id, createReservationDto);
  }

  @Get('my')
  async getMyReservations(@CurrentUser() user: any) {
    const member = await this.membersService.findByUserId(user.userId);
    return this.reservationsService.findByMember(member.id);
  }

  @Get('all')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  getAllReservations(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('status') status?: string,
  ) {
    return this.reservationsService.findAll(page || 1, pageSize || 20, status);
  }

  @Patch(':id/cancel')
  async cancel(
    @CurrentUser() user: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const member = await this.membersService.findByUserId(user.userId);
    return this.reservationsService.cancel(id, member.id);
  }

  @Get('book/:bookId/queue')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  getBookQueue(@Param('bookId', ParseIntPipe) bookId: number) {
    return this.reservationsService.findPendingByBook(bookId);
  }
}