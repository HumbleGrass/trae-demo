import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  Query, UseGuards, ParseIntPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../entities/user.entity';
import { MembersService } from './members.service';
import { CreateMemberDto, CreateMemberWithUserDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MemberQueryDto } from './dto/member-query.dto';

@Controller('members')
@UseGuards(AuthGuard('jwt'))
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  create(@Body() createMemberDto: CreateMemberWithUserDto) {
    return this.membersService.create(createMemberDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  findAll(@Query() query: MemberQueryDto) {
    return this.membersService.findAll(query);
  }

  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return this.membersService.findByUserId(user.userId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.membersService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    return this.membersService.update(id, updateMemberDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.membersService.remove(id);
  }

  @Patch(':id/borrow-limit')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  updateBorrowLimit(
    @Param('id', ParseIntPipe) id: number,
    @Body('limit') limit: number,
  ) {
    return this.membersService.updateBorrowLimit(id, limit);
  }
}