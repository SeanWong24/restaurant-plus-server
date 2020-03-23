import { Injectable } from "https://deno.land/x/alosaur/src/mod.ts";
import { TableRepository } from "../repository/table-repository.ts";
import { Table } from "../domain-model/table.ts";

@Injectable()
export class TableLogic {
  constructor(private tableRepository: TableRepository) {}

  async add(name: string, capacity: number) {
    const newTable = new Table(name, capacity);
    return await this.tableRepository.addSingle(newTable);
  }

  async get(name?: string) {
    if (name) {
      return await this.tableRepository.getSingle(name);
    } else {
      return this.tableRepository.getAll();
    }
  }
}
