import { ObjectId } from "https://deno.land/x/mongo/ts/types.ts";
import { RepositoryConnection } from "./repository-connection.ts";
import { UpdateResult } from "https://deno.land/x/mongo/mod.ts";

export declare type QueryOptions = {
  ignoredPropertyList: string[]
}

export abstract class Repository<T> {
  readonly CollectionName: string;
  readonly queryParameterConvertionList: {
    predicate: (filter: any) => boolean,
    convertor: (filter: any) => void
  }[] = [];

  constructor(private repoConnect: RepositoryConnection, collectionName: string) {
    this.CollectionName = collectionName;
  }

  get collection() {
    return this.repoConnect.database?.collection(this.CollectionName);
  }

  async find(filter?: any, options?: QueryOptions) {
    for (const convertion of this.queryParameterConvertionList) {
      if (convertion.predicate(filter)) {
        convertion.convertor(filter);
      }
    }

    const projectionEntries = options?.ignoredPropertyList?.map(ignoredPropertyName => [ignoredPropertyName, 0]) || [];
    projectionEntries.unshift(["_id", 0]);
    const projection = Object.fromEntries(projectionEntries);
    return await this.collection?.aggregate([
      {
        $addFields: {
          id: {
            $toString: "$_id"
          }
        }
      },
      { $match: filter },
      {
        $project: projection
      }
    ]) || [];
  }

  async addSingle(object: T) {
    return await this.collection?.insertOne(object) as T;
  }

  async update(id: string, changeDefinition: any): Promise<UpdateResult | undefined>;
  async update(idList: string[], changeDefinition: any): Promise<UpdateResult | undefined>;
  async update(idOrIdList: string | string[], changeDefinition: any) {
    if (Array.isArray(idOrIdList)) {
      return this.updateMultiple(idOrIdList, changeDefinition);
    } else {
      return this.updateSingle(idOrIdList, changeDefinition);
    }
  }

  private async updateSingle(id: string, changeDefinition: any) {
    return await this.collection?.updateOne(
      { _id: ObjectId(id) },
      { $set: changeDefinition }
    );
  }

  private async updateMultiple(idList: string[], changeDefinition: any) {
    return await this.collection?.updateMany(
      { _id: { $in: idList.map(id => ObjectId(id)) } },
      { $set: changeDefinition }
    );
  }

  async delete(id: string): Promise<number | undefined>;
  async delete(idList: string[]): Promise<number | undefined>;
  async delete(idOrIdList: string | string[]) {
    if (Array.isArray(idOrIdList)) {
      return this.deleteMany(idOrIdList);
    } else {
      return this.deleteOne(idOrIdList);
    }
  }
  private async deleteOne(id: string) {
    return await this.collection?.deleteOne(
      { _id: ObjectId(id) },
    );
  }
  private async deleteMany(idList: string[]) {
    const objectIdList = [];
    for (const id of idList) {
      objectIdList.push(ObjectId(id));
    }
    return await this.collection?.deleteMany({ _id: {$in: objectIdList}});
  }
}
