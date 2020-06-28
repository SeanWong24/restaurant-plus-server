import {
  HookTarget,
  Context,
  getCookies,
  ForbiddenError,
  container,
  Content,
} from "../deps/alosaur.ts";
import { UserRepository } from "../repository/user-repository.ts";
import { RoleRepository } from "../repository/role-repository.ts";
import { User } from "../domain-model/user.ts";
import { Role } from "../domain-model/role.ts";

export interface QueryParameterPermissionDefinition {
  parameterName?: string;
  permissionList?: string[];
}

export interface AuthorizationOptions {
  permissionList?: string[];
  queryParameterPermissionList?: QueryParameterPermissionDefinition[];
}

export class AuthorizationHook
  implements HookTarget<unknown, AuthorizationOptions> {
  private userRepository?: UserRepository;
  private roleRepository?: RoleRepository;

  constructor() {
    // TODO use DI
    setTimeout(() => {
      this.userRepository = container.resolve(UserRepository);
      this.roleRepository = container.resolve(RoleRepository);
    }, 0);
  }

  async onPreAction(
    context: Context<unknown>,
    options: AuthorizationOptions = {},
  ) {
    const serverRequest = context.request.serverRequest;
    const cookies = getCookies(serverRequest);
    const authorizationToken = cookies["token"];
    const authorizationUser = (await this.userRepository?.find(
      { token: authorizationToken || "(null)" },
    ) || [])[0] as User;

    let isAuthorized = false;
    let role: Role;
    if (authorizationUser) {
      const roleId = authorizationUser.roleId;
      role = (await this.roleRepository?.find({ id: roleId }) || [])[0] as Role;
    } else {
      role =
        (await this.roleRepository?.find({ name: "Guest" }) || [])[0] as Role;
    }

    const isMethodAuthorized = !options.permissionList ||
      options.permissionList.every((permission) =>
        role.permissionList.includes(permission)
      );
    const areParametersAuthorized = !options.queryParameterPermissionList ||
      options.queryParameterPermissionList.every((definition) =>
        !new URLSearchParams(context.request.url).get(
          definition.parameterName || "",
        ) ||
        !definition.permissionList ||
        definition.permissionList
          .every((permission) => role.permissionList.includes(permission))
      );
    isAuthorized = isMethodAuthorized && areParametersAuthorized;

    if (!isAuthorized) {
      const error = new ForbiddenError(
        "You do not have the permission to access this resource.",
      );
      context.response.error = error;
      context.response.result = Content(error, error.httpCode || 500);
      context.response.setImmediately();
    }
  }
}
