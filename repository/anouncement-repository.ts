import { Injectable } from "https://deno.land/x/alosaur/src/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.4.0/ts/types.ts";
import { RepoConnection } from "./repoConnection.ts";
import { Anouncement } from "../domain-model/anouncement.ts";

@Injectable()
export class AnouncementRepository {
    readonly CollectionName = "anouncement";

    get collection() {
        return this.repository.database?.collection(this.CollectionName);
    }

    constructor(private repository: RepoConnection) { }

    async addSingle(menuCategory: Anouncement) {
        return await this.collection?.insertOne(menuCategory);
    }

    async getSingle(id: string) {
        return this.getMenuCategoryInstanceWithId(
            await this.collection?.findOne({ _id: ObjectId(id) }) as Anouncement
        );
    }

    async getAllIds() {
        const menuCategoryIdList = await this.collection?.aggregate(
            [
                { $project: { _id: 0, id: { $toString: "$_id" }, title: 1 } }
            ]
        ) as string[];
        return menuCategoryIdList;
    }

    async modify(id: string, changDefinition: any) {
        return await this.collection?.updateOne(
            { _id: ObjectId(id) },
            { $set: changDefinition }
        );
    }

    async delete(id: string) {
        return await this.collection?.deleteOne(
            { _id: ObjectId(id) }
        );
    }

    private getMenuCategoryInstanceWithId(menuCategory: Anouncement) {
        menuCategory.id = (menuCategory as any)._id.$oid;
        return menuCategory;
    }
}