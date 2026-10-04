import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service.js";

import { CreateCompanyDto } from "./dto/create-company.dto.js";
import { DeleteCompanyDto } from "./dto/delete-company.dto.js";

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrUpdateCompany(
    createCompanyDto: CreateCompanyDto,
  ) {
    const {
      name,
      type,
      address,
      billing_email,
    } = createCompanyDto;

    const existingCompany =
      await this.prisma.company.findUnique({
        where: {
          name,
        },
      });

    // Company already exists → UPDATE
    if (existingCompany) {
      const updatedCompany =
        await this.prisma.company.update({
          where: {
            id: existingCompany.id,
          },

          data: {
            type,
            address,
            billing_email,
          },
        });

      return {
        message: "Company updated successfully",
        operation: "update",
        company: updatedCompany,
      };
    }

    // Company doesn't exist → CREATE
    const newCompany =
      await this.prisma.company.create({
        data: {
          name,
          type,
          address,
          billing_email,
        },
      });

    return {
      message: "Company created successfully",
      operation: "create",
      company: newCompany,
    };
  }

  async deleteCompany(
    deleteCompanyDto: DeleteCompanyDto,
  ) {
    const { name } = deleteCompanyDto;

    const existingCompany =
      await this.prisma.company.findUnique({
        where: {
          name,
        },
      });

    if (!existingCompany) {
      throw new NotFoundException(
        "Company not found",
      );
    }

    await this.prisma.company.delete({
      where: {
        id: existingCompany.id,
      },
    });

    return {
      message: "Company deleted successfully",
      operation: "delete",
    };
  }
}