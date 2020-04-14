import { container } from "https://deno.land/x/alosaur/src/injection/index.ts";
import { UserRepository } from "../repository/user-repository.ts";
import { RoleRepository } from "../repository/role-repository.ts";
import { ForbiddenError } from "https://deno.land/x/alosaur/src/mod.ts";
import { User } from "../domain-model/user.ts";
import { Role } from "../domain-model/role.ts";


export function authorize(accessItem: string, authorizationTokenIndex: number) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalFunction = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const userRepository = container.resolve(UserRepository);
            const roleRepository = container.resolve(RoleRepository);
            const authorizationToken = args[authorizationTokenIndex];
            const authorizationUser = (await userRepository.getMultiple({ token: authorizationToken || "(null)" }))[0] as User;
            let isAuthorized = false;
            if (authorizationUser) {
                const roleId = authorizationUser.roleId;
                const role = await roleRepository.getSingle(roleId) as Role;
                isAuthorized = !!role.accessList.find(access => access === accessItem);
            }

            if (isAuthorized) {
                return await originalFunction.apply(this, args);
            } else {
                throw new ForbiddenError('You do not have the permission to access this resource.');
            }
        }
    };
}