import { Injectable } from "https://raw.githubusercontent.com/SeanWong24/alosaur/cors-builder/src/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo/ts/types.ts";
import { RepositoryConnection } from "./repository-connection.ts";
import { Table } from "../domain-model/table.ts";
import { Repository } from "./repository.ts";

@Injectable()
export class TableRepository extends Repository<Table> {
  constructor(private repoConnection: RepositoryConnection) {
    super(repoConnection, "tables");
  }

  async delete(id: string) {
    return await this.collection?.deleteOne(
      { _id: ObjectId(id) },
    );
  }
}
