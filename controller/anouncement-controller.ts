import {
    Controller,
    Content,
    QueryParam,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Cookie
} from "https://deno.land/x/alosaur/src/mod.ts";
import { Injectable } from "https://deno.land/x/alosaur/src/mod.ts";
import { Anouncement } from "../domain-model/anouncement.ts";
import { AnouncementLogic } from "../logic/anouncement-logic.ts";
import { authorize } from "../logic/authorization.ts";
import { Role } from "../domain-model/role.ts";

@Injectable()
@Controller("/anouncement")
export class AnouncementController {
    constructor(private anouncementLogic: AnouncementLogic) { }

    @Get("")
    async get(@QueryParam("id") id: string) {
        return Content(await this.anouncementLogic.get(id));
    }

    @Post("/add")
    @authorize(Role.Permission.Anouncement_Write, 1)
    async add(@Body() anouncement: Anouncement, @Cookie("token") authorizationToken: string) {
        return Content(await this.anouncementLogic.add(anouncement));
    }

    @Put("/modify")
    @authorize(Role.Permission.Anouncement_Write, 1)
    async modify(@Body() anouncement: Anouncement, @Cookie("token") authorizationToken: string) {
        const id = anouncement.id as string;
        delete anouncement.id;
        return Content(await this.anouncementLogic.modify(id, anouncement));
    }

    @Delete("")
    @authorize(Role.Permission.Anouncement_Write, 1)
    async delete(@QueryParam("id") id: string, @Cookie("token") authorizationToken: string) {
        return Content(await this.anouncementLogic.delete(id));
    }
}