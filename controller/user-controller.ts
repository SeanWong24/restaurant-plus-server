import {
  Controller,
  Body,
  Post,
  QueryParam,
  Get,
  Put,
  Res,
  Response,
  Cookie,
  Singleton,
  setCookie,
  deleteCookie,
  UseHook,
} from "../deps/alosaur.ts";
import { UserLogic } from "../logic/user-logic.ts";
import { Role } from "../domain-model/role.ts";
import { LogHook } from "../utilities/log-hook.ts";
import {
  AuthorizationHook,
  AuthorizationOptions,
} from "../utilities/authorization-hook.ts";

@Singleton()
@Controller("/user")
export class UserController {
  constructor(private userLogic: UserLogic) {}

  @UseHook(LogHook)
  @UseHook(
    AuthorizationHook,
    { permissionList: [Role.Permission.User_Read] },
  )
  @Get("")
  async get(@QueryParam("id") id: string) {
    return await this.userLogic.get(id);
  }

  @UseHook(LogHook)
  @Get("/self")
  async getSelf(@Cookie("token") token: string) {
    return await this.userLogic.getSelf(token);
  }

  @UseHook(LogHook, { logBody: true })
  @Post("/login")
  async login(
    @Body() loginInfo: { type: string; message: string },
    @Res() response: Response,
  ) {
    const token = await this.userLogic.login(
      loginInfo?.type,
      loginInfo?.message,
    );
    if (token) {
      setCookie(response, { name: "token", value: token, path: "/" });
    }
    return "";
  }

  @UseHook(LogHook)
  @Post("/logout")
  async logout(@Cookie("token") token: string, @Res() response: Response) {
    // deleteCookie(response, "token");
    response.headers?.append(
      "Set-Cookie",
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT",
    );
    return "";
  }

  @UseHook(LogHook)
  @UseHook(
    AuthorizationHook,
    { permissionList: [Role.Permission.User_Write] },
  )
  @Post("/add")
  async add(
    @QueryParam("name") name: string,
    @QueryParam("roleName") roleName: string,
  ) {
    return await this.userLogic.add(name, roleName);
  }

  @UseHook(
    AuthorizationHook,
    { permissionList: [Role.Permission.Role_Read] },
  )
  @UseHook(LogHook)
  @Get("/role")
  async getRole(@QueryParam("id") id: string) {
    return await this.userLogic.getRole(id);
  }

  @UseHook(LogHook)
  @Get("/role/self")
  async getRoleSelf(@Cookie("token") token: string) {
    return await this.userLogic.getRoleSelf(token);
  }

  @UseHook(LogHook)
  @Post("/role/add")
  async addRole(
    @QueryParam("name") name: string,
    @QueryParam("token") token: string,
  ) {
    // TODO implement the logic
    return "";
  }

  @UseHook(LogHook)
  @Put("/role/modify")
  async modifyRole(
    @QueryParam("id") id: string,
    @QueryParam("name") name: string,
    @QueryParam("token") token: string,
  ) {
    // TODO implement the logic
    return "";
  }
}
