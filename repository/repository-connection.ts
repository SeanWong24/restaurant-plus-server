import { MongoClient, Database, init } from "../deps/mongo.ts";

export class RepositoryConnection {
  client: MongoClient | undefined;
  database: Database | undefined;

  constructor(connectionString: string, databaseName: string) {
    this.connect(connectionString, databaseName);
  }

  async connect(connectionString: string, databaseName: string) {
    const client = new MongoClient();
    client.connectWithUri(connectionString);

    this.client = client;
    this.database = client.database(databaseName);
  }
}
