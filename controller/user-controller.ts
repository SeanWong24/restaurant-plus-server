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
import { LogHook } from "../utilities/log-hook.ts";

@Injectable()
@UseHook(LogHook)
@Controller("/user")
export class UserController {
  constructor(private userLogic: UserLogic) {}

  @Get("")
  @Authorize([Role.Permission.User_Read])
  async get(
    @QueryParam("id") id: string,
    @Cookie("token") @AuthorizationToken authorizationToken: string,
  ) {
    return Content(await this.userLogic.get(id));
  }

  @Get("/self")
  async getSelf(@Cookie("token") token: string) {
    return Content(await this.userLogic.getSelf(token));
  }

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

  @Post("/logout")
  async logout(@Cookie("token") token: string, @Res() response: Response) {
    // delCookie(response, "token");
    response.headers?.append(
      "Set-Cookie",
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT",
    );
    return "";
  }

  @Post("/add")
  @Authorize([Role.Permission.User_Write])
  async add(
    @QueryParam("name") name: string,
    @QueryParam("roleName") roleName: string,
    @Cookie("token") @AuthorizationToken authorizationToken: string,
  ) {
    return Content(await this.userLogic.add(name, roleName));
  }

  @Get("/role")
  @Authorize([Role.Permission.Role_Read])
  async getRole(
    @QueryParam("id") id: string,
    @Cookie("token") @AuthorizationToken authorizationToken: string,
  ) {
    return Content(await this.userLogic.getRole(id));
  }

  @Get("/role/self")
  async getRoleSelf(@Cookie("token") token: string) {
    return Content(await this.userLogic.getRoleSelf(token));
  }

  @Post("/role/add")
  async addRole(
    @QueryParam("name") name: string,
    @QueryParam("token") token: string,
  ) {
    // TODO implement the logic
    return Content("");
  }

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
