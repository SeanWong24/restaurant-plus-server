import {
  App,
  Area,
  container,
  CorsBuilder
} from "https://raw.githubusercontent.com/SeanWong24/alosaur/cors-builder/src/mod.ts";
import { TableController } from "./controller/table-controller.ts";
import { RepositoryConnection } from "./repository/repository-connection.ts";
import { UserController } from "./controller/user-controller.ts";
import { MenuController } from "./controller/menu-controller.ts";
import { BillController } from "./controller/bill-controller.ts";
import { PaymentController } from "./controller/payment-controller.ts";
import { AnouncementController } from "./controller/anouncement-controller.ts";

container.register<RepositoryConnection>(
  RepositoryConnection,
  {
    useValue: new RepositoryConnection(
      "mongodb+srv://ros:ros123456@cluster0-atpei.azure.mongodb.net",
      "test"
    )
  }
);

// Declare module
@Area({
  controllers: [
    UserController,
    AnouncementController,
    TableController,
    MenuController,
    BillController,
    PaymentController
  ]
})
export class HomeArea {
}

// Create alosaur application
const app = new App({
  areas: [HomeArea]
});

app.useCors(
  new CorsBuilder()
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials()
);

const port = Deno.args[0];
app.listen(port ? "0.0.0.0:" + port : undefined);
