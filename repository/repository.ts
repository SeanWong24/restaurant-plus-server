import { ObjectId } from "https://deno.land/x/mongo@v0.4.0/ts/types.ts";
import { RepoConnection } from "./repoConnection.ts";

export abstract class Repository<T> {
  readonly CollectionName: string;

  constructor(private repoConnect: RepoConnection, collectionName: string) {
    this.CollectionName = collectionName;
  }

  get collection() {
    return this.repoConnect.database?.collection(this.CollectionName);
  }

  async addSingle(object: T){
    return await this.collection?.insertOne(object) as T;
  }

  async getSingle(id: string) {
    return this.getObjectInstanceWithId(
      await this.collection?.findOne({ _id: ObjectId(id) }) as T
    );
  }

  async getMultiple(filter?: any) {
    const objectList = await this.collection?.find(filter) as T[];
    return objectList?.map((object) => this.getObjectInstanceWithId(object));
  }

  async modify(id: string, changeDefinition: any) {
    return await this.collection?.updateOne(
      { _id: ObjectId(id) },
      { $set: changeDefinition }
    );
  }

  async modifyMany(idList: string[], changeDefinition: any) {
    return await this.collection?.updateMany(
      { _id: {$in: idList.map(id => ObjectId(id))}},
      { $set: changeDefinition }
    )
  }

  protected getObjectInstanceWithId(object: any) {
    object.id = object._id.$oid;
    return object;
  }
}
