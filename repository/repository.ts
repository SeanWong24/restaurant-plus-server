import { ObjectId } from "https://deno.land/x/mongo/ts/types.ts";
import { RepositoryConnection } from "./repository-connection.ts";

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
    ]);
  }

  async addSingle(object: T) {
    return await this.collection?.insertOne(object) as T;
  }

  // async getSingle(id: string) {
  //   return this.getObjectInstanceWithId(
  //     await this.collection?.findOne({ _id: ObjectId(id) }) as T
  //   );
  // }

  // async getMultiple(filter?: any) {
  //   const objectList = await this.collection?.find(filter) as T[];
  //   return objectList?.map((object) => this.getObjectInstanceWithId(object));
  // }

  async modify(id: string, changeDefinition: any) {
    return await this.collection?.updateOne(
      { _id: ObjectId(id) },
      { $set: changeDefinition }
    );
  }

  async modifyMany(idList: string[], changeDefinition: any) {
    return await this.collection?.updateMany(
      { _id: { $in: idList.map(id => ObjectId(id)) } },
      { $set: changeDefinition }
    )
  }

  protected getObjectInstanceWithId(object: any) {
    object.id = object._id.$oid;
    return object;
  }
}
