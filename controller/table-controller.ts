import {
  Controller,
  Content,
  QueryParam,
  Get,
  Post,
  Put,
  Delete
} from "https://deno.land/x/alosaur/src/mod.ts";
import { Injectable } from "https://deno.land/x/alosaur/src/mod.ts";
import { TableLogic } from "../logic/table-logic.ts";

@Injectable()
@Controller("/table")
export class TableController {
  constructor(private tableLogic: TableLogic) { }

  @Get("")
  async get(@QueryParam("id") id: string) {
    return Content(await this.tableLogic.get(id));
  }

  @Post("/add")
  async add(@QueryParam("name") name: string, @QueryParam("capacity") capacity: number) {
    return Content(await this.tableLogic.add(name, capacity));
  }

  @Put("/open")
  async open(
    @QueryParam("id") id: string,
    @QueryParam("occupied") occupied: number
  ) {
    return Content(await this.tableLogic.open(id, occupied));
  }

  @Put("/reserve")
  async reserve(
    @QueryParam("id") id: string,
    @QueryParam("occupied") occupied: number
  ) {
    return Content(await this.tableLogic.reserve(id, occupied));
  }

  @Put("/modify")
  async modify(
    @QueryParam("id") id: string,
    @QueryParam("name") name: string,
    @QueryParam("capacity") capacity: number
  ) {
    if (id) {
      const changeDefinition = {} as any;
      if (name) {
        changeDefinition["name"] = name;
      }
      if (capacity) {
        changeDefinition["capacity"] = capacity;
      }
      return Content(await this.tableLogic.modify(id, changeDefinition));
    } else {
      return Content("");
    }
  }

  @Put("/toggle-availability")
  async toggleAvailability(@QueryParam("id") id: string) {
    return Content(await this.tableLogic.toggleAvailability(id));
  }

  @Put("/modify-occupied")
  async modifyOccupied(
    @QueryParam("id") id: string,
    @QueryParam("occupied") occupied: number
  ) {
    if (id) {
      const changeDefinition = {} as any;
      if (occupied) {
        changeDefinition["occupied"] = occupied;
      }
      return Content(await this.tableLogic.modify(id, changeDefinition));
    } else {
      return Content("");
    }
  }

  @Put("/close")
  async close(@QueryParam("id") id: string) {
    return Content(await this.tableLogic.close(id));
  }

  @Put("/free")
  async free(@QueryParam("id") id: string) {
    return Content(await this.tableLogic.free(id));
  }

  @Put("/disable")
  async disable(@QueryParam("id") id: string) {
    return Content(await this.tableLogic.disable(id));
  }

  @Delete("")
  async delete(@QueryParam("id") id: string) {
    return Content(await this.tableLogic.delete(id));
  }
}