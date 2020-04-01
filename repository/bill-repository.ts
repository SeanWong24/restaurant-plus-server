import { Injectable } from "https://deno.land/x/alosaur/src/mod.ts";
import { RepoConnection } from "./repoConnection.ts";
import { Repository } from "./repository.ts";
import { Bill } from "../domain-model/bill.ts";

@Injectable()
export class BillRepository extends Repository<Bill> {
  constructor(private repoConnection: RepoConnection) {
    super(repoConnection, "bills");
  }
}
