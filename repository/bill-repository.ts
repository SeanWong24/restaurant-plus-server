import { Injectable } from "https://raw.githubusercontent.com/SeanWong24/alosaur/cors-builder/src/mod.ts";
import { RepositoryConnection } from "./repository-connection.ts";
import { Repository } from "./repository.ts";
import { Bill } from "../domain-model/bill.ts";

@Injectable()
export class BillRepository extends Repository<Bill> {
  constructor(private repoConnection: RepositoryConnection) {
    super(repoConnection, "bills");
  }
}
