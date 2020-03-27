import {
  App,
  Area,
  container,
  CorsBuilder
} from "https://deno.land/x/alosaur/src/mod.ts";
import { TableController } from "./controller/table-controller.ts";
import { Repository } from "./repository/repository.ts";
import { UserController } from "./controller/user-controller.ts";
import { MenuController } from "./controller/menu-controller.ts";
import { BillController } from "./controller/bill-controller.ts";
import { PaymentController } from "./controller/payment-controller.ts";

container.register<Repository>(
  Repository,
  {
    useValue: new Repository(
      "mongodb+srv://ros:ros123456@cluster0-atpei.azure.mongodb.net",
      "test"
    )
  }
);

// Declare module
@Area({
  controllers: [
    UserController,
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
    .WithOrigins("*")
    .AllowAnyMethod()
    .AllowAnyHeaders()
);

const port = Deno.args[0];
app.listen(port ? "0.0.0.0:" + port : undefined);
