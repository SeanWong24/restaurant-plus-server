import { Injectable } from "https://deno.land/x/alosaur/src/mod.ts";
import { RoleRepository } from "../repository/role-repository.ts";
import { UserRepository } from "../repository/user-repository.ts";
import { User } from "../domain-model/user.ts";
import { Role } from "../domain-model/role.ts";

@Injectable()
export class UserLogic {
    constructor(private roleRepository: RoleRepository, private userRepository: UserRepository) { }

    async get(id: string, authorizationToken: string) {
        const authorizationUser = (await this.userRepository.getMultiple({ token: authorizationToken || "(null)" }))[0] as User;
        if (authorizationUser) {
            const roleId = authorizationUser.roleId;
            const role = await this.roleRepository.getSingle(roleId) as Role;
            if (role.accessList.find(access => access === Role.AccessItem.User_Read)) {
                if (id) {
                    return await this.userRepository.getSingle(id);
                } else {
                    return await this.userRepository.getMultiple();
                }
            }
        }
        return "";
    }

    async getSelf(token: string) {
        return (await this.userRepository.getMultiple({ token: token || "(null)" }))[0] as User;
    }

    async login(loginType: string, loginMessage: string) {
        if (loginType && loginMessage) {
            switch (loginType) {
                case "accessCode":
                    const user = (await this.userRepository.getMultiple({ accessCode: loginMessage }))[0] as User;
                    if (user) {
                        // TODO use a generated token instead
                        user.token = user.id as string;
                        this.userRepository.modify(user.id as string, { token: user.token });
                        return user.token;
                    }
            }
        }
        return "";
    }

    async logout(token: string) {
        if (token) {
            const user = (await this.userRepository.getMultiple({ token }))[0] as User;
            if (user) {
                this.userRepository.modify(user.id as string, { token: "" });
            }
        }
        return "";
    }

    async add(name: string, roleName: string, authorizationToken: string) {
        if (name && roleName && authorizationToken) {
            const authorizationUser = (await this.userRepository.getMultiple({ token: authorizationToken || "(null)" }))[0] as User;
            if (authorizationUser) {
                const roleId = authorizationUser.roleId;
                const role = await this.roleRepository.getSingle(roleId) as Role;
                if (role.accessList.find(access => access === Role.AccessItem.User_Write)) {
                    const newUserRole = (await this.roleRepository.getMultiple({ name: roleName }))[0] as Role;
                    if (newUserRole?.id) {
                        let accessCode;
                        do {
                            accessCode = Math.round(Math.random() * 100000).toString();
                        } while ((await this.userRepository.getMultiple({ accessCode })).length > 0);
                        const user = new User(name, newUserRole.id, accessCode);
                        await this.userRepository.addSingle(user);
                    }
                }
            }
        }
        return "";
    }
}