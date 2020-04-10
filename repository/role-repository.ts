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
        Role.AccessItem.User_Read,
        Role.AccessItem.User_Write
      ],
      true
    ),
    new Role(
      "Manager",
      [
        Role.AccessItem.User_Read,
        Role.AccessItem.User_Write
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
        const role = await this.collection?.findOne({ name: defaultRole.name }) as Role;
        if (!role) {
          await this.collection?.insertOne(defaultRole);
        }
      }
    }, 0);
  }
}