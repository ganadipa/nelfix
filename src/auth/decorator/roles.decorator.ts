import { SetMetadata } from '@nestjs/common';

type TAcceptableRoles = 'GUEST' | 'USER' | 'ADMIN';

export const Roles = (roles: TAcceptableRoles[]) => {
  return SetMetadata('roles', roles);
};
