import { Injectable } from "https://deno.land/x/alosaur/src/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.4.0/ts/types.ts";
import { RepoConnection } from "./repoConnection.ts";
import { Table } from "../domain-model/table.ts";
@Injectable()
export class TableRepository {
  readonly CollectionName = "tables";

  get collection() {
    return this.repository.database?.collection(this.CollectionName);
  }

  constructor(private repository: RepoConnection) {}

  async addSingle(table: Table) {
    return await this.collection?.insertOne(table);
  }

  async getSingle(id: string) {
    return this.getTableInstanceWithId(
      await this.collection?.findOne({ _id: ObjectId(id) }) as Table
    );
  }

  async getAll() {
    const tableList = await this.collection?.find() as Table[];
    return tableList?.map(table => this.getTableInstanceWithId(table));
  }

  async modify(id: string, changeDefinition: any) {
    return await this.collection?.updateOne(
      { _id: ObjectId(id) },
      { $set: changeDefinition }
    );
  }

  async delete(id: string) {
    return await this.collection?.deleteOne(
      { _id: ObjectId(id) }
    );
  }

  private getTableInstanceWithId(table: Table) {
    table.id = (table as any)._id.$oid;
    return table;
  }
}
