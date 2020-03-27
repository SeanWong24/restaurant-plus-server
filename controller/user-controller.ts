import {
  Controller,
  Content,
  Body,
  Post,
  QueryParam,
  Get,
  Put
} from "https://deno.land/x/alosaur/src/mod.ts";
import { Injectable } from "https://deno.land/x/alosaur/src/mod.ts";

@Injectable()
@Controller("/user")
export class UserController {
  constructor() { }

  @Get("")
  async get(@QueryParam("id") id: string, @QueryParam("token") token: string) {
    // TODO implement the logic and return the user object or user list
    return Content("");
  }

  @Post("/login")
  async login(@Body() loginInfo: { type: string, message: string }) {
    // TODO implement the logic and return the token
    return Content("");
  }

  @Post("/logout")
  async logout(@QueryParam("token") token: string) {
    // TODO implement the logic
    return Content("");
  }

  @Post("/add")
  async add(@QueryParam("name") name: string, @QueryParam("token") token: string) {
    // TODO implement the logic and return the id of the new user
    return Content("");
  }

  @Get("/role")
  async getRole(@QueryParam("id") id: string, @QueryParam("token") token: string) {
    // TODO implement the logic and return the role object or role list
    return Content("");
  }

  @Post("/role/add")
  async addRole(@QueryParam("name") name: string, @QueryParam("token") token: string) {
    // TODO implement the logic
    return Content("");
  }

  @Put("/role/modify")
  async modifyRole(
    @QueryParam("id") id: string,
    @QueryParam("name") name: string,
    @QueryParam("token") token: string
  ) {
    // TODO implement the logic
    return Content("");
  }
}