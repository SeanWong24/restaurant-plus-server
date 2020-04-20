import { Injectable } from "https://deno.land/x/alosaur/src/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo/ts/types.ts";
import { RepositoryConnection } from "./repository-connection.ts";
import { Table } from "../domain-model/table.ts";
import { Repository } from "./repository.ts";

@Injectable()
export class TableRepository extends Repository<Table> {
  constructor(private repoConnection: RepositoryConnection) {
    super(repoConnection, "tables");
  }
}
