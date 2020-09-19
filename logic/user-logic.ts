import { Singleton } from "../deps/alosaur.ts";
import { RoleRepository } from "../repository/role-repository.ts";
import { UserRepository } from "../repository/user-repository.ts";
import { User } from "../domain-model/user.ts";
import { Role } from "../domain-model/role.ts";

@Singleton()
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
          break;
        case "Microsoft":
          const user1 =
            (await this.userRepository.find({ microsoftId: loginMessage }))[
              0
            ] as User;
          if (user1) {
            // TODO use a generated token instead
            user1.token = user1.id as string;
            this.userRepository.update(
              user1.id as string,
              { token: user1.token },
            );
            return user1.token;
          }
          break;
          case "Google":
          const user2 =
            (await this.userRepository.find({ googleId: loginMessage }))[
              0
            ] as User;
          if (user2) {
            // TODO use a generated token instead
            user2.token = user2.id as string;
            this.userRepository.update(
              user2.id as string,
              { token: user2.token },
            );
            return user2.token;
          }
          break;
          case "Facebook":
          const user3 =
            (await this.userRepository.find({ facebookId: loginMessage }))[
              0
            ] as User;
          if (user3) {
            // TODO use a generated token instead
            user3.token = user3.id as string;
            this.userRepository.update(
              user3.id as string,
              { token: user3.token },
            );
            return user3.token;
          }
          break;
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

  async add(name: string, roleName: string, thirdPartyInfo?: {provider: string, id: string}) {
    const newUserRole =
      (await this.roleRepository.find({ name: roleName }))[0] as Role;
      if (newUserRole?.id) {
        const user = new User(name, newUserRole.id);
      if (thirdPartyInfo) {
        switch (thirdPartyInfo.provider) {
          case "Facebook":
            //TODO: implement when switch on https
            break;
          case "Google":
            //TODO: implement when figure out the variable name google returns
            break;
          case "Microsoft":
            user.microsoftId = thirdPartyInfo.id;
            break;
        }
      } else {
        let accessCode;
        do {
          accessCode = Math.round(Math.random() * 1000000).toString();
        } while ((await this.userRepository.find({ accessCode })).length > 0);
        user.accessCode = accessCode;
      }
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
