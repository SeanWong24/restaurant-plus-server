import { Injectable } from "../external-modules/alosaur.ts";
import { RepositoryConnection } from "./repository-connection.ts";
import { Repository } from "./repository.ts";
import { Bill } from "../domain-model/bill.ts";

@Injectable()
export class BillRepository extends Repository<Bill> {
  constructor(private repoConnection: RepositoryConnection) {
    super(repoConnection, "bills");
    this.initializeQueryParameterConvertionList();
  }

  private initializeQueryParameterConvertionList() {
    this.queryParameterConvertionList.push({
      predicate: (filter) => filter.timeFrom || filter.timeTo,
      convertor: (filter) => {
        filter.startTime = {
          $gte: filter.timeFrom ? new Date(filter.timeFrom) : undefined,
          $lte: filter.timeTo ? new Date(filter.timeTo) : undefined,
        };
        delete filter.timeFrom;
        delete filter.timeTo;
      },
    });
  }
}
