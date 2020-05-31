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
  Cookie,
  Injectable,
  setCookie,
  delCookie,
  UseHook,
} from "../deps/alosaur.ts";
import { UserLogic } from "../logic/user-logic.ts";
import { Authorize, AuthorizationToken } from "../utilities/authorization.ts";
import { Role } from "../domain-model/role.ts";
import { LogHook, LogOptions } from "../utilities/log-hook.ts";

@Injectable()
@Controller("/user")
export class UserController {
  constructor(private userLogic: UserLogic) {}

  @UseHook(LogHook)
  @Get("")
  @Authorize([Role.Permission.User_Read])
  async get(
    @QueryParam("id") id: string,
    @Cookie("token") @AuthorizationToken authorizationToken: string,
  ) {
    return Content(await this.userLogic.get(id));
  }

  @UseHook(LogHook)
  @Get("/self")
  async getSelf(@Cookie("token") token: string) {
    return Content(await this.userLogic.getSelf(token));
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
    // delCookie(response, "token");
    response.headers?.append(
      "Set-Cookie",
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT",
    );
    return "";
  }

  @UseHook(LogHook)
  @Post("/add")
  @Authorize([Role.Permission.User_Write])
  async add(
    @QueryParam("name") name: string,
    @QueryParam("roleName") roleName: string,
    @Cookie("token") @AuthorizationToken authorizationToken: string,
  ) {
    return Content(await this.userLogic.add(name, roleName));
  }

  @UseHook(LogHook)
  @Get("/role")
  @Authorize([Role.Permission.Role_Read])
  async getRole(
    @QueryParam("id") id: string,
    @Cookie("token") @AuthorizationToken authorizationToken: string,
  ) {
    return Content(await this.userLogic.getRole(id));
  }

  @UseHook(LogHook)
  @Get("/role/self")
  async getRoleSelf(@Cookie("token") token: string) {
    return Content(await this.userLogic.getRoleSelf(token));
  }

  @UseHook(LogHook)
  @Post("/role/add")
  async addRole(
    @QueryParam("name") name: string,
    @QueryParam("token") token: string,
  ) {
    // TODO implement the logic
    return Content("");
  }

  @UseHook(LogHook)
  @Put("/role/modify")
  async modifyRole(
    @QueryParam("id") id: string,
    @QueryParam("name") name: string,
    @QueryParam("token") token: string,
  ) {
    // TODO implement the logic
    return Content("");
  }
}
