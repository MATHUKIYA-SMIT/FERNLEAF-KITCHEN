import {
  Body,
  Controller,
  Delete,
  Post,
} from "@nestjs/common";

import { CompanyService } from "./company.service.js";

import { CreateCompanyDto } from "./dto/create-company.dto.js";
import { DeleteCompanyDto } from "./dto/delete-company.dto.js";

@Controller("companies")
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
  ) {}

  @Post()
  async createOrUpdateCompany(
    @Body() createCompanyDto: CreateCompanyDto,
  ) {
    return this.companyService.createOrUpdateCompany(
      createCompanyDto,
    );
  }

  @Delete()
  async deleteCompany(
    @Body() deleteCompanyDto: DeleteCompanyDto,
  ) {
    return this.companyService.deleteCompany(
      deleteCompanyDto,
    );
  }
}