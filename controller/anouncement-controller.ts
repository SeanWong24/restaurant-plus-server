import {
  Controller,
  Content,
  QueryParam,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Cookie,
  Injectable,
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

@Injectable()
@UseHook(LogHook)
@Controller("/anouncement")
export class AnouncementController {
  constructor(private anouncementLogic: AnouncementLogic) {}

  @Get("")
  async get(@QueryParam("id") id: string) {
    return Content(await this.anouncementLogic.get(id));
  }

  @UseHook(
    AuthorizationHook,
    Object.assign(
      new AuthorizationOptions(),
      { permissionList: [Role.Permission.Anouncement_Write] },
    ),
  )
  @Post("/add")
  async add(@Body() anouncement: Anouncement) {
    return Content(await this.anouncementLogic.add(anouncement));
  }

  @UseHook(
    AuthorizationHook,
    Object.assign(
      new AuthorizationOptions(),
      { permissionList: [Role.Permission.Anouncement_Write] },
    ),
  )
  @Put("/modify")
  async modify(@Body() anouncement: Anouncement) {
    const id = anouncement.id as string;
    delete anouncement.id;
    return Content(await this.anouncementLogic.modify(id, anouncement));
  }

  @UseHook(
    AuthorizationHook,
    Object.assign(
      new AuthorizationOptions(),
      { permissionList: [Role.Permission.Anouncement_Write] },
    ),
  )
  @Delete("")
  async delete(@QueryParam("id") id: string) {
    return Content(await this.anouncementLogic.delete(id));
  }
}
