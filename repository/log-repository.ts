import { Singleton } from "../deps/alosaur.ts";
import { RepositoryConnection } from "./repository-connection.ts";
import { Repository } from "./repository.ts";
import { Log } from "../domain-model/log.ts";

@Singleton()
export class LogRepository extends Repository<Log> {
  constructor(private repoConnection: RepositoryConnection) {
    super(repoConnection, "logs");
  }
}
