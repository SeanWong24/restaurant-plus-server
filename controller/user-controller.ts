import {
  Controller,
  Content,
  Body,
  Post,
  QueryParam,
  Get
} from "https://deno.land/x/alosaur/src/mod.ts";
import { Injectable } from "https://deno.land/x/alosaur/src/mod.ts";

@Injectable()
@Controller("/user")
export class UserController {
  constructor() { }

  @Post("login")
  async login(@Body() loginInfo: { type: string, message: string }) {
    // TODO implement the logic and return the token
    return Content("");
  }

  @Post("logout")
  async logout(@QueryParam("token") token: string) {
    // TODO implement the logic
    return Content("");
  }

  @Post("add")
  async add(@QueryParam("name") name: string, @QueryParam("token") token: string) {
    // TODO implement the logic and return the id of the new user
    return Content("");
  }

  @Get("")
  async get(@QueryParam("id") id: string) {
    // TODO implement the logic and return the user object
    return Content("");
  }
}