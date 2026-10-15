import {
  CreateUserBodyRolesItem,
  GetAuthenticatedCommsUser200DataRolesItem as Role,
} from "../http/generated/api.schemas";

const RolesData: Role[] = Object.values(CreateUserBodyRolesItem);

export { Role, RolesData };
