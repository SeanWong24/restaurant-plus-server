import { Singleton } from "../deps/alosaur.ts";
import { RepositoryConnection } from "./repository-connection.ts";
import { Anouncement } from "../domain-model/anouncement.ts";
import { Repository } from "./repository.ts";

@Singleton()
export class AnouncementRepository extends Repository<Anouncement> {
  constructor(private repoConnection: RepositoryConnection) {
    super(repoConnection, "anouncements");
  }

  async getAllIds() {
    const menuCategoryIdList = await this.collection?.aggregate(
      [
        { $project: { _id: 0, id: { $toString: "$_id" }, title: 1 } },
      ],
    ) as string[];
    return menuCategoryIdList;
  }
}
