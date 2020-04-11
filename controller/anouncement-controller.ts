import {
    Controller,
    Content,
    QueryParam,
    Get,
    Post,
    Put,
    Delete,
    Body
} from "https://deno.land/x/alosaur/src/mod.ts";
import { Injectable } from "https://deno.land/x/alosaur/src/mod.ts";
import { Anouncement } from "../domain-model/anouncement.ts";
import { AnouncementLogic } from "../logic/anouncement-logic.ts";

@Injectable()
@Controller("/anouncement")
export class AnouncementController {
    constructor(private anouncementLogic: AnouncementLogic) { }

    @Get("")
    async get(@QueryParam("id") id: string) {
        return Content(await this.anouncementLogic.get(id));
    }

    @Post("/add")
    async add(@Body() anouncement: Anouncement) {
        return Content(await this.anouncementLogic.add(anouncement));
    }

    @Put("/modify")
    async modify(@Body() anouncement: Anouncement) {
        const id = anouncement.id as string;
        delete anouncement.id;
        return Content(await this.anouncementLogic.modify(id, anouncement));
    }

    @Delete("")
    async delete(@QueryParam("id") id: string) {
        return Content(await this.anouncementLogic.delete(id));
    }
}