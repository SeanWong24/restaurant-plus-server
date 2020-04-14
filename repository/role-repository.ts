import { Injectable } from "https://deno.land/x/alosaur/src/mod.ts";
import { RepositoryConnection } from "./repository-connection.ts";
import { Repository } from "./repository.ts";
import { Role } from "../domain-model/role.ts";

@Injectable()
export class RoleRepository extends Repository<Role> {

  readonly defaultRoleList = [
    new Role(
      "Administrator",
      [
        Role.Permission.User_Read,
        Role.Permission.User_Write,
        Role.Permission.Role_Read
      ],
      true
    ),
    new Role(
      "Manager",
      [
        Role.Permission.User_Read,
        Role.Permission.User_Write,
        Role.Permission.Role_Read
      ],
      true
    ),
    new Role(
      "Staff",
      [],
      true
    ),
    new Role(
      "Customer",
      [],
      true
    ),
    new Role(
      "Guest",
      [],
      true
    )
  ];

  constructor(private repoConnection: RepositoryConnection) {
    super(repoConnection, "roles");
    this.addDefaultRolesIfNotExsiting();
  }

  addDefaultRolesIfNotExsiting() {
    setTimeout(async () => {
      for (const defaultRole of this.defaultRoleList) {
        const role = (await this.getMultiple({ name: defaultRole.name }) || [])[0] as Role;
        if (role) {
          await this.modify(role.id as string, defaultRole);
        } else {
          await this.addSingle(defaultRole);
        }
      }
    }, 0);
  }
}