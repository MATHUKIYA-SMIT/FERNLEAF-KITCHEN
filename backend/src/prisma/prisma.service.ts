import "dotenv/config";

import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../generated/prisma/client.js";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const connection_string =
      process.env.DATABASE_URL;

    if (!connection_string) {
      throw new Error(
        "DATABASE_URL is not defined."
      );
    }

    const adapter = new PrismaPg({
      connectionString: connection_string,
    });

    super({
      adapter,
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}