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
} from "../external-modules/alosaur.ts";
import { Anouncement } from "../domain-model/anouncement.ts";
import { AnouncementLogic } from "../logic/anouncement-logic.ts";
import { Authorize, AuthorizationToken } from "../utilities/authorization.ts";
import { Role } from "../domain-model/role.ts";

@Injectable()
@Controller("/anouncement")
export class AnouncementController {
  constructor(private anouncementLogic: AnouncementLogic) {}

  @Get("")
  async get(@QueryParam("id") id: string) {
    return Content(await this.anouncementLogic.get(id));
  }

  @Post("/add")
  @Authorize([Role.Permission.Anouncement_Write])
  async add(
    @Body() anouncement: Anouncement,
    @Cookie("token") @AuthorizationToken authorizationToken: string,
  ) {
    return Content(await this.anouncementLogic.add(anouncement));
  }

  @Put("/modify")
  @Authorize([Role.Permission.Anouncement_Write])
  async modify(
    @Body() anouncement: Anouncement,
    @Cookie("token") @AuthorizationToken authorizationToken: string,
  ) {
    const id = anouncement.id as string;
    delete anouncement.id;
    return Content(await this.anouncementLogic.modify(id, anouncement));
  }

  @Delete("")
  @Authorize([Role.Permission.Anouncement_Write])
  async delete(
    @QueryParam("id") id: string,
    @Cookie("token") @AuthorizationToken authorizationToken: string,
  ) {
    return Content(await this.anouncementLogic.delete(id));
  }
}
