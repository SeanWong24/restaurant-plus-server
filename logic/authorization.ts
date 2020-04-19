import { container } from "https://deno.land/x/alosaur/src/injection/index.ts";
import { UserRepository } from "../repository/user-repository.ts";
import { RoleRepository } from "../repository/role-repository.ts";
import { ForbiddenError } from "https://deno.land/x/alosaur/src/mod.ts";
import { User } from "../domain-model/user.ts";
import { Role } from "../domain-model/role.ts";


declare type ParameterAuthorizationDefinition = {
    index: number,
    permissionList?: string[]
};

export function Authorize(permissionList?: string[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor | number) {
        if (typeof descriptor === "number") {
            let parameterAuthorizationList = target["#parameterAuthorizationList_" + propertyKey] as ParameterAuthorizationDefinition[];
            if (!parameterAuthorizationList) {
                parameterAuthorizationList = [];
                target["#parameterAuthorizationList_" + propertyKey] = parameterAuthorizationList;
            }
            parameterAuthorizationList.push({
                index: descriptor,
                permissionList
            });
        } else {
            const originalFunction = descriptor.value;

            descriptor.value = async function (...args: any[]) {
                const authorizationTokenIndex = target["#authorizationTokenParameterIndex_" + propertyKey];
                const userRepository = container.resolve(UserRepository);
                const roleRepository = container.resolve(RoleRepository);
                const authorizationToken = args[authorizationTokenIndex];
                const authorizationUser = (await userRepository.find({ token: authorizationToken || "(null)" }))[0] as User;
                const parameterAuthorizationList = (target["#parameterAuthorizationList_" + propertyKey] || []) as ParameterAuthorizationDefinition[];
                let isAuthorized = false;
                let role: Role;
                if (authorizationUser) {
                    const roleId = authorizationUser.roleId;
                    role = (await roleRepository.find({ roleId }))[0] as Role;
                } else {
                    role = (await roleRepository.find({ name: "Guest" }))[0] as Role;
                }
                const isMethodAuthorized = !permissionList || permissionList.every(permission => role.permissionList.includes(permission));
                const areParametersAuthorized = parameterAuthorizationList
                    .every(definition => !args[definition.index] || !definition.permissionList || definition.permissionList
                        .every(permission => role.permissionList.includes(permission)));
                isAuthorized = isMethodAuthorized && areParametersAuthorized;

                if (isAuthorized) {
                    return await originalFunction.apply(this, args);
                } else {
                    throw new ForbiddenError('You do not have the permission to access this resource.');
                }
            }
        }
    };
}

export function AuthorizationToken(target: any, propertyKey: string, index: number) {
    target["#authorizationTokenParameterIndex_" + propertyKey] = index;
}