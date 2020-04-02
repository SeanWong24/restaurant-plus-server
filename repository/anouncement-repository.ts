import { Injectable } from "https://deno.land/x/alosaur/src/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.4.0/ts/types.ts";
import { RepoConnection } from "./repoConnection.ts";
import { Anouncement } from "../domain-model/anouncement.ts";
import { Repository } from "./repository.ts";

@Injectable()
export class AnouncementRepository extends Repository<Anouncement>{

    constructor(private repoConnection: RepoConnection) {
        super(repoConnection, "anouncements");
    }

    async getAllIds() {
        const menuCategoryIdList = await this.collection?.aggregate(
            [
                { $project: { _id: 0, id: { $toString: "$_id" }, title: 1 } }
            ]
        ) as string[];
        return menuCategoryIdList;
    }

    async delete(id: string) {
        return await this.collection?.deleteOne(
            { _id: ObjectId(id) }
        );
    }
}