import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import { JwtService } from "@nestjs/jwt";

import * as bcrypt from "bcrypt";

import { PrismaService } from "../prisma/prisma.service.js";

import { LoginDto } from "./dto/login.dto.js";
import { SignupDto } from "./dto/signup.dto.js";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,

    private readonly jwt_service: JwtService,
  ) {}

  async signup(
    signup_dto: SignupDto
  ) {
    const {
      name,
      email,
      password,
      confirm_password,
      role,
    } = signup_dto;

    /*
     * Check password confirmation
     */
    if (
      password !== confirm_password
    ) {
      throw new ConflictException(
        "Passwords do not match."
      );
    }

    /*
     * Check existing user
     */
    const existing_user =
      await this.prisma.user.findFirst({
        where: {
          email,
        },
      });

    if (existing_user) {
      throw new ConflictException(
        "User with this email already exists."
      );
    }

    /*
     * Hash password
     */
    const hashed_password =
      await bcrypt.hash(password, 10);

    /*
     * Create user
     *
     * IMPORTANT:
     * New users are NOT immediately
     * allowed to login.
     */
    const user =
      await this.prisma.user.create({
        data: {
          name,
          email,
          password: hashed_password,
          role,
          is_available: false,
        },
      });

    return {
      message:
        "Account created successfully. Please wait for admin approval.",

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_available:
          user.is_available,
      },
    };
  }

  async login(
    login_dto: LoginDto
  ) {
    const {
      email,
      password,
    } = login_dto;

    /*
     * Find user
     */
    const user =
      await this.prisma.user.findFirst({
        where: {
          email,
        },
      });

    if (!user) {
      throw new UnauthorizedException(
        "Invalid email or password."
      );
    }

    /*
     * Compare password
     */
    const password_matches =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!password_matches) {
      throw new UnauthorizedException(
        "Invalid email or password."
      );
    }

    /*
     * Check admin approval
     */
    if (!user.is_available) {
      throw new ForbiddenException(
        "Your account is waiting for admin approval."
      );
    }

    /*
     * Create JWT payload
     */
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    /*
     * Generate JWT
     */
    const access_token =
      await this.jwt_service.signAsync(
        payload
      );

    return {
      message:
        "Login successful.",

      access_token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_available:
          user.is_available,
      },
    };
  }
}