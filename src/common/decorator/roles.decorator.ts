import { SetMetadata } from '@nestjs/common';

export type TAcceptableRoles = 'GUEST' | 'USER' | 'ADMIN';

/**
 *
 *
 * @param roles acceptable roles
 * @param redirectPath  path to redirect to if user does not have the required role
 * @returns
 */
export const Roles = (roles: TAcceptableRoles[], redirectPath?: string) => {
  return SetMetadata('authMetadata', { roles, redirectPath });
};
