import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from "@nestjs/common";

import { KitchenEmployeeService } from "./kitchen_employee.service.js";

@Controller("kitchen-employees")
export class KitchenEmployeeController {
  constructor(
    private readonly kitchen_employee_service:
      KitchenEmployeeService
  ) {}

  /*
   * Get pending requests
   * and active employees.
   */
  @Get()
  async getKitchenEmployees() {
    return this.kitchen_employee_service
      .getKitchenEmployees();
  }

  /*
   * Accept employee request.
   */
  @Patch(":id/accept")
  async acceptKitchenEmployee(
    @Param("id") id: string
  ) {
    return this.kitchen_employee_service
      .acceptKitchenEmployee(id);
  }

  /*
   * Reject pending request.
   */
  @Delete(":id/reject")
  async rejectKitchenEmployee(
    @Param("id") id: string
  ) {
    return this.kitchen_employee_service
      .rejectKitchenEmployee(id);
  }

  /*
   * Remove active employee.
   */
  @Delete(":id")
  async removeKitchenEmployee(
    @Param("id") id: string
  ) {
    return this.kitchen_employee_service
      .removeKitchenEmployee(id);
  }
}