import { Injectable } from "https://deno.land/x/alosaur/src/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.4.0/ts/types.ts";
import { RepoConnection } from "./repoConnection.ts";
import { Repository } from "./repository.ts";
import { BillItem } from "../domain-model/bill-item.ts";

@Injectable()
export class BillItemRepository extends Repository<BillItem> {
  constructor(private repoConnection: RepoConnection) {
    super(repoConnection, "bill-items");
  }

  async delete(id: string) {
    return await this.collection?.deleteOne(
      { _id: ObjectId(id) },
    );
  }
}
