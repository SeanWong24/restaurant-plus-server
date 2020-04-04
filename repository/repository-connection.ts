import * as mongo from "https://deno.land/x/mongo/mod.ts";

export class RepositoryConnection {
  client: mongo.MongoClient | undefined;
  database: mongo.Database | undefined;

  constructor(connectionString: string, databaseName: string) {
    this.connect(connectionString, databaseName);
  }

  async connect(connectionString: string, databaseName: string) {
    await mongo.init();
    const client = new mongo.MongoClient();
    client.connectWithUri(connectionString);

    this.client = client;
    this.database = client.database(databaseName);
  }
}