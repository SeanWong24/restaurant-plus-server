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
    @QueryParam("occupied") occupied: number,
    @QueryParam("time") time: string
  ) {
    // TODO implement logic
    return Content("");
  }

  @Put("/reserve")
  async reserve(
    @QueryParam("id") id: string,
    @QueryParam("occupied") occupied: number,
    @QueryParam("time") time: string
  ) {
    // TODO implement logic
    return Content("");
  }

  @Put("/modify")
  async modify(
    @QueryParam("id") id: string,
    @QueryParam("name") name: string,
    @QueryParam("occupied") occupied: number,
    @QueryParam("capacity") capacity: string
  ) {
    // TODO implement logic
    return Content("");
  }

  @Put("/close")
  async close(@QueryParam("id") id: string, @QueryParam("time") time: string) {
    // TODO implement logic
    return Content("");
  }

  @Put("/free")
  async free(@QueryParam("id") id: string, @QueryParam("time") time: string) {
    // TODO implement logic
    return Content("");
  }

  @Put("/disable")
  async disable(@QueryParam("id") id: string, @QueryParam("time") time: string) {
    // TODO implement logic
    return Content("");
  }

  @Delete("")
  async delete(@QueryParam("id") id: string) {
    // TODO implement logic
    return Content("");
  }
}