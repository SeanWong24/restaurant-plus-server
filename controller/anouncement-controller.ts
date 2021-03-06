import {
  Controller,
  QueryParam,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Cookie,
  Singleton,
  UseHook,
} from "../deps/alosaur.ts";
import { Anouncement } from "../domain-model/anouncement.ts";
import { AnouncementLogic } from "../logic/anouncement-logic.ts";
import { Role } from "../domain-model/role.ts";
import { LogHook } from "../utilities/log-hook.ts";
import {
  AuthorizationHook,
  AuthorizationOptions,
} from "../utilities/authorization-hook.ts";

@Singleton()
@UseHook(LogHook)
@Controller("/anouncement")
export class AnouncementController {
  constructor(private anouncementLogic: AnouncementLogic) {}

  @UseHook(
    AuthorizationHook,
    { permissionList: [Role.Permission.Anouncement_Read] },
  )
  @Get("")
  async get(@QueryParam("id") id: string) {
    return await this.anouncementLogic.get(id);
  }

  @UseHook(
    AuthorizationHook,
    { permissionList: [Role.Permission.Anouncement_Write] },
  )
  @Post("/add")
  async add(@Body() anouncement: Anouncement) {
    return await this.anouncementLogic.add(anouncement);
  }

  @UseHook(
    AuthorizationHook,
    { permissionList: [Role.Permission.Anouncement_Write] },
  )
  @Put("/modify")
  async modify(@Body() anouncement: Anouncement) {
    const id = anouncement.id as string;
    delete anouncement.id;
    return await this.anouncementLogic.modify(id, anouncement);
  }

  @UseHook(
    AuthorizationHook,
    { permissionList: [Role.Permission.Anouncement_Write] },
  )
  @Delete("")
  async delete(@QueryParam("id") id: string) {
    return await this.anouncementLogic.delete(id);
  }
}
