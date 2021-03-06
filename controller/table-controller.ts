import {
  Controller,
  QueryParam,
  Get,
  Post,
  Put,
  Delete,
  Singleton,
  UseHook,
} from "../deps/alosaur.ts";
import { TableLogic } from "../logic/table-logic.ts";
import { LogHook } from "../utilities/log-hook.ts";
import {
  AuthorizationOptions,
  AuthorizationHook,
} from "../utilities/authorization-hook.ts";
import { Role } from "../domain-model/role.ts";

@Singleton()
@UseHook(LogHook)
@Controller("/table")
export class TableController {
  constructor(private tableLogic: TableLogic) {}

  @UseHook(
    AuthorizationHook,
    { permissionList: [Role.Permission.Table_Read] },
  )
  @Get("")
  async get(
    @QueryParam("id") id: string,
    @QueryParam("status") status: string,
  ) {
    if (id) {
      return await this.tableLogic.get({ id });
    } else {
      const filter = {
        status,
      };
      return await this.tableLogic.get(filter);
    }
  }

  @UseHook(
    AuthorizationHook,
    { permissionList: [Role.Permission.Table_Write] },
  )
  @Post("/add")
  async add(
    @QueryParam("name") name: string,
    @QueryParam("capacity") capacity: number,
  ) {
    return await this.tableLogic.add(name, capacity);
  }

  @UseHook(
    AuthorizationHook,
    { permissionList: [Role.Permission.Table_Write] },
  )
  @Put("/open")
  async open(
    @QueryParam("id") id: string,
    @QueryParam("occupied") occupied: number,
  ) {
    return await this.tableLogic.open(id, occupied);
  }

  @UseHook(
    AuthorizationHook,
    { permissionList: [Role.Permission.Table_Write] },
  )
  @Put("/reserve")
  async reserve(
    @QueryParam("id") id: string,
    @QueryParam("occupied") occupied: number,
  ) {
    return await this.tableLogic.reserve(id, occupied);
  }

  @UseHook(
    AuthorizationHook,
    { permissionList: [Role.Permission.Table_Write] },
  )
  @Put("/transfer")
  async transfer(
    @QueryParam("id") id: string,
    @QueryParam("transferId") transferId: string,
  ) {
    return this.tableLogic.transfer(id, transferId);
  }

  @UseHook(
    AuthorizationHook,
    {
      permissionList: [Role.Permission.Table_Write],
      queryParameterPermissionList: [
        {
          parameterName: "name",
          permissionList: [Role.Permission.Table_Write_Advanced],
        },
      ],
    },
  )
  @Put("/modify")
  async modify(
    @QueryParam("id") id: string,
    @QueryParam("name") name: string,
    @QueryParam("capacity") capacity: number,
  ) {
    if (id) {
      const changeDefinition = {} as any;
      if (name) {
        changeDefinition["name"] = name;
      }
      if (capacity) {
        changeDefinition["capacity"] = capacity;
      }
      return await this.tableLogic.modify(id, changeDefinition);
    } else {
      return "";
    }
  }

  @UseHook(
    AuthorizationHook,
    { permissionList: [Role.Permission.Table_Write_Advanced] },
  )
  @Put("/toggle-availability")
  async toggleAvailability(@QueryParam("id") id: string) {
    return await this.tableLogic.toggleAvailability(id);
  }

  @UseHook(
    AuthorizationHook,
    { permissionList: [Role.Permission.Table_Write] },
  )
  @Put("/modify-occupied")
  async modifyOccupied(
    @QueryParam("id") id: string,
    @QueryParam("occupied") occupied: number,
  ) {
    if (id) {
      const changeDefinition = {} as any;
      if (occupied) {
        changeDefinition["occupied"] = occupied;
      }
      return await this.tableLogic.modify(id, changeDefinition);
    } else {
      return "";
    }
  }

  @UseHook(
    AuthorizationHook,
    { permissionList: [Role.Permission.Table_Write] },
  )
  @Put("/close")
  async close(@QueryParam("id") id: string) {
    return await this.tableLogic.close(id);
  }

  @UseHook(
    AuthorizationHook,
    { permissionList: [Role.Permission.Table_Write] },
  )
  @Put("/free")
  async free(@QueryParam("id") id: string) {
    return await this.tableLogic.free(id);
  }

  @UseHook(
    AuthorizationHook,
    { permissionList: [Role.Permission.Table_Write] },
  )
  @Put("/disable")
  async disable(@QueryParam("id") id: string) {
    return await this.tableLogic.disable(id);
  }

  @UseHook(
    AuthorizationHook,
    { permissionList: [Role.Permission.Table_Write_Advanced] },
  )
  @Delete("")
  async delete(@QueryParam("id") id: string) {
    return await this.tableLogic.delete(id);
  }
}
