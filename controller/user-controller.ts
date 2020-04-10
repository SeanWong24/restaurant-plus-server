import {
  Controller,
  Content,
  Body,
  Post,
  QueryParam,
  Get,
  Put,
  Res,
  Response,
  Cookie
} from "https://raw.githubusercontent.com/SeanWong24/alosaur/cors-builder/src/mod.ts";
import { Injectable } from "https://raw.githubusercontent.com/SeanWong24/alosaur/cors-builder/src/mod.ts";
import { UserLogic } from "../logic/user-logic.ts";
import { setCookie, delCookie } from "https://deno.land/std@v0.38.0/http/cookie.ts";

@Injectable()
@Controller("/user")
export class UserController {
  constructor(private userLogic: UserLogic) { }

  @Get("")
  async get(@QueryParam("id") id: string, @Cookie("token") authorizationToken: string) {
    return Content(await this.userLogic.get(id, authorizationToken));
  }

  @Get("/self")
  async getSelf(@Cookie("token") token: string) {
    return Content(await this.userLogic.getSelf(token));
  }

  @Post("/login")
  async login(@Body() loginInfo: { type: string, message: string }, @Res() response: Response) {
    const token = await this.userLogic.login(loginInfo?.type, loginInfo?.message);
    if (token) {
      setCookie(response, { name: "token", value: token });
    }
    return response;
  }

  @Post("/logout")
  async logout(@Cookie("token") token: string, @Res() response: Response) {
    delCookie(response, "token");
    return response;
  }

  @Post("/add")
  async add(@QueryParam("name") name: string, @QueryParam("roleName") roleName: string, @Cookie("token") authorizationToken: string) {
    return Content(await this.userLogic.add(name, roleName, authorizationToken));
  }

  @Get("/role")
  async getRole(@QueryParam("id") id: string, @Cookie("token") authorizationToken: string) {
    return Content(await this.userLogic.getRole(id, authorizationToken));
  }

  @Get("/role/self")
  async getRoleSelf(@Cookie("token") token: string) {
    return Content(await this.userLogic.getRoleSelf(token));
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