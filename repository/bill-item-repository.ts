import { Singleton } from "../deps/alosaur.ts";
import { RepositoryConnection } from "./repository-connection.ts";
import { Repository } from "./repository.ts";
import { BillItem } from "../domain-model/bill-item.ts";

@Singleton()
export class BillItemRepository extends Repository<BillItem> {
  constructor(private repoConnection: RepositoryConnection) {
    super(repoConnection, "bill-items");
  }

  async findMaxGroupId(billItemIdList: string[]) {
    const maxQuery = (await this.collection?.aggregate(
      [
        {
          $group: {
            _id: null,
            max: {
              $max: "$groupId",
            },
          },
        },
        {
          $project: {
            _id: 0,
            max: 1,
          },
        },
      ],
    ));
    if (maxQuery) {
      return maxQuery[0].max;
    } else {
      return 1;
    }
  }
}
