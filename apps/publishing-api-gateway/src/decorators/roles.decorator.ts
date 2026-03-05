import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@app/contracts/user/user.interface';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
