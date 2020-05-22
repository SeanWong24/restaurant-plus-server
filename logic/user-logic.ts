import { Injectable } from "../external-modules/alosaur.ts";
import { RoleRepository } from "../repository/role-repository.ts";
import { UserRepository } from "../repository/user-repository.ts";
import { User } from "../domain-model/user.ts";
import { Role } from "../domain-model/role.ts";

@Injectable()
export class UserLogic {
  constructor(
    private roleRepository: RoleRepository,
    private userRepository: UserRepository,
  ) {}

  async get(id: string) {
    if (id) {
      return await this.userRepository.find({ id });
    } else {
      return await this.userRepository.find({});
    }
  }

  async getSelf(token: string) {
    return (await this.userRepository.find({ token: token || "(null)" }))[
      0
    ] as User;
  }

  async login(loginType: string, loginMessage: string) {
    if (loginType && loginMessage) {
      switch (loginType) {
        case "accessCode":
          const user =
            (await this.userRepository.find({ accessCode: loginMessage }))[
              0
            ] as User;
          if (user) {
            // TODO use a generated token instead
            user.token = user.id as string;
            this.userRepository.update(
              user.id as string,
              { token: user.token },
            );
            return user.token;
          }
      }
    }
    return "";
  }

  async logout(token: string) {
    if (token) {
      const user = (await this.userRepository.find({ token }))[0] as User;
      if (user) {
        return await this.userRepository.update(
          user.id as string,
          { token: "" },
        );
      }
    }
    return "";
  }

  async add(name: string, roleName: string) {
    const newUserRole =
      (await this.roleRepository.find({ name: roleName }))[0] as Role;
    if (newUserRole?.id) {
      let accessCode;
      do {
        accessCode = Math.round(Math.random() * 1000000).toString();
      } while ((await this.userRepository.find({ accessCode })).length > 0);
      const user = new User(name, newUserRole.id, accessCode);
      return await this.userRepository.insert(user);
    }
    return "";
  }

  async getRole(id: string) {
    if (id) {
      return await this.roleRepository.find({ id });
    } else {
      return await this.roleRepository.find({});
    }
  }

  async getRoleSelf(token: string) {
    const user = this.getSelf(token);
    if (user) {
      return await this.roleRepository.find({ "id": (await user).roleId });
    }
    return "";
  }
}
