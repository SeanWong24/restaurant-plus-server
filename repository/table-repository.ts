import { Injectable } from "../external-modules/alosaur.ts";
import { RepositoryConnection } from "./repository-connection.ts";
import { Table } from "../domain-model/table.ts";
import { Repository } from "./repository.ts";

@Injectable()
export class TableRepository extends Repository<Table> {
  constructor(private repoConnection: RepositoryConnection) {
    super(repoConnection, "tables");
  }
}
