import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { PrismaModule } from "./prisma/prisma.module.js";
import { AuthModule } from "./auth/auth.module.js";
import { CompanyModule } from "./company/company.module.js";
import { KitchenEmployeeModule } from "./kitchen_employee/kitchen_employee.module.js";

@Module({
    imports: [
    PrismaModule,
    AuthModule,
    CompanyModule,
    KitchenEmployeeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
