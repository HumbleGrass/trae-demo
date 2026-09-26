import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateMemberDto } from './create-member.dto';

export class UpdateMemberDto extends PartialType(
  PickType(CreateMemberDto, ['name', 'phone', 'idCard', 'email', 'gender', 'birthDate', 'borrowLimit'] as const)
) {}