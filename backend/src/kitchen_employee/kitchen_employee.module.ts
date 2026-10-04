import { Module } from "@nestjs/common";

import { KitchenEmployeeController } from "./kitchen_employee.controller.js";
import { KitchenEmployeeService } from "./kitchen_employee.service.js";

@Module({
  controllers: [
    KitchenEmployeeController,
  ],

  providers: [
    KitchenEmployeeService,
  ],
})
export class KitchenEmployeeModule {}