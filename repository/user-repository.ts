import { Singleton } from "../deps/alosaur.ts";
import { RepositoryConnection } from "./repository-connection.ts";
import { Repository } from "./repository.ts";
import { User } from "../domain-model/user.ts";

@Singleton()
export class UserRepository extends Repository<User> {
  constructor(private repoConnection: RepositoryConnection) {
    super(repoConnection, "users");
  }
}
