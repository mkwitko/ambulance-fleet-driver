import {
  GetAuthenticatedCommsUser200Data,
  GetAuthenticatedCommsUser200DataRolesItem,
} from "../http/generated/api.schemas";

export function hasPermission(
  user: GetAuthenticatedCommsUser200Data | undefined,
  permission: string,
  bypassAdmin = true
): boolean {
  if (!user) return false;
  if (
    bypassAdmin &&
    user.roles.includes(
      GetAuthenticatedCommsUser200DataRolesItem["sys_admin:accessAll"]
    )
  )
    return true;

  return user.roles.includes(
    permission as GetAuthenticatedCommsUser200DataRolesItem
  );
}
