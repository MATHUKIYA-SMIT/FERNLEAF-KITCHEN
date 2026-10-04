import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service.js";

@Injectable()
export class KitchenEmployeeService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  /*
   * Get all kitchen employees.
   *
   * Pending requests:
   * is_available = false
   *
   * Active employees:
   * is_available = true
   *
   * Pending requests are returned separately
   * from active employees.
   */
  async getKitchenEmployees() {
    const users =
      await this.prisma.user.findMany({
        where: {
          role: {
            not: "Admin",
          },
        },

        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          is_available: true,
        },

        orderBy: {
          is_available: "asc",
        },
      });

    return {
      pending_requests: users
        .filter(
          (user) =>
            user.is_available === false
        )
        .map((user) => ({
          id: user.id,
          username: user.name,
          email: user.email,
          role: user.role,
          is_available:
            user.is_available,
        })),

      active_employees: users
        .filter(
          (user) =>
            user.is_available === true
        )
        .map((user) => ({
          id: user.id,
          username: user.name,
          email: user.email,
          role: user.role,
          is_available:
            user.is_available,
        })),
    };
  }

  /*
   * Accept pending employee request.
   *
   * false → true
   */
  async acceptKitchenEmployee(
    id: string
  ) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          id,
        },
      });

    if (!user) {
      throw new NotFoundException(
        "Employee not found"
      );
    }

    /*
     * Admin should never be managed
     * as a kitchen employee.
     */
    if (user.role === "Admin") {
      throw new NotFoundException(
        "Employee not found"
      );
    }

    /*
     * Already active.
     */
    if (user.is_available) {
      return {
        message:
          "Employee is already active",
      };
    }

    const updated_user =
      await this.prisma.user.update({
        where: {
          id,
        },

        data: {
          is_available: true,
        },

        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          is_available: true,
        },
      });

    return {
      message:
        "Employee accepted successfully",

      employee: {
        id: updated_user.id,
        username: updated_user.name,
        email: updated_user.email,
        role: updated_user.role,
        is_available:
          updated_user.is_available,
      },
    };
  }

  /*
   * Reject pending employee request.
   *
   * The complete user entry is deleted.
   */
  async rejectKitchenEmployee(
    id: string
  ) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          id,
        },
      });

    if (!user) {
      throw new NotFoundException(
        "Employee not found"
      );
    }

    if (user.role === "Admin") {
      throw new NotFoundException(
        "Employee not found"
      );
    }

    /*
     * Only pending requests can be rejected.
     */
    if (user.is_available) {
      throw new NotFoundException(
        "Active employee cannot be rejected"
      );
    }

    await this.prisma.user.delete({
      where: {
        id,
      },
    });

    return {
      message:
        "Employee request rejected successfully",
    };
  }

  /*
   * Remove an already active employee.
   *
   * The user is deleted from the database.
   */
  async removeKitchenEmployee(
    id: string
  ) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          id,
        },
      });

    if (!user) {
      throw new NotFoundException(
        "Employee not found"
      );
    }

    if (user.role === "Admin") {
      throw new NotFoundException(
        "Employee not found"
      );
    }

    /*
     * Only active employees can be removed.
     */
    if (!user.is_available) {
      throw new NotFoundException(
        "Pending employee request cannot be removed"
      );
    }

    await this.prisma.user.delete({
      where: {
        id,
      },
    });

    return {
      message:
        "Employee removed successfully",
    };
  }
}