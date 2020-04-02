import { Injectable } from "https://deno.land/x/alosaur/src/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo/ts/types.ts";
import { RepoConnection } from "./repoConnection.ts";
import { Table } from "../domain-model/table.ts";
import { Repository } from "./repository.ts";

@Injectable()
export class TableRepository extends Repository<Table> {
  constructor(private repoConnection: RepoConnection) {
    super(repoConnection, "tables");
  }

  async delete(id: string) {
    return await this.collection?.deleteOne(
      { _id: ObjectId(id) },
    );
  }
}
