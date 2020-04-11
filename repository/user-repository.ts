import { Injectable } from "https://deno.land/x/alosaur/src/mod.ts";
import { RepositoryConnection } from "./repository-connection.ts";
import { Repository } from "./repository.ts";
import { User } from "../domain-model/user.ts";

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private repoConnection: RepositoryConnection) {
    super(repoConnection, "users");
  }
}
