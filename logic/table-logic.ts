import { Injectable } from "https://deno.land/x/alosaur/src/mod.ts";
import { TableRepository } from "../repository/table-repository.ts";
import { Table } from "../domain-model/table.ts";

@Injectable()
export class TableLogic {
  constructor(private tableRepository: TableRepository) { }

  async add(name: string, capacity: number) {
    const newTable = new Table(name, capacity);
    return await this.tableRepository.addSingle(newTable);
  }

  async get(id?: string) {
    if (id) {
      return await this.tableRepository.getSingle(id);
    } else {
      return await this.tableRepository.getAll();
    }
  }

  async open(id: string, occupied: number, time: string) {
    if (id && occupied && time) {
      if ((await this.get(id) as Table).status === Table.Status.Free) {
        const changeDefinition = {
          occupied,
          time,
          status: Table.Status.Using
        };
        return await this.tableRepository.modify(id, changeDefinition);
      }
    }
  }

  async reserve(id: string, occupied: number, time: string) {
    if (id && occupied && time) {
      if ((await this.get(id) as Table).status === Table.Status.Free) {
        const changeDefinition = {
          occupied,
          time,
          status: Table.Status.Reserved
        };
        return await this.tableRepository.modify(id, changeDefinition);
      }
    }
  }

  async modify(id: string, changeDefinition: any) {
    if (id) {
      return await this.tableRepository.modify(id, changeDefinition);
    }
  }

  async delete(id: string) {
    if(id) {
      return await this.tableRepository.delete(id);
    }
  }

}
