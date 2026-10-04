import {
  Body,
  Controller,
  Post,
  Res,
} from "@nestjs/common";

import type { Response } from "express";

import { AuthService } from "./auth.service.js";

import { LoginDto } from "./dto/login.dto.js";
import { SignupDto } from "./dto/signup.dto.js";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly auth_service: AuthService
  ) {}

  @Post("signup")
  async signup(
    @Body() signup_dto: SignupDto
  ) {
    return this.auth_service.signup(
      signup_dto
    );
  }

  @Post("login")
  async login(
    @Body() login_dto: LoginDto,

    @Res({
      passthrough: true,
    })
    response: Response
  ) {
    const result =
      await this.auth_service.login(
        login_dto
      );

    /*
     * Store JWT inside
     * HTTP-only cookie.
     */
    response.cookie(
      "access_token",
      result.access_token,
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite:
          process.env.NODE_ENV ===
          "production"
            ? "none"
            : "lax",

        maxAge:
          24 *
          60 *
          60 *
          1000,
      }
    );

    return {
      message: result.message,

      user: result.user,
    };
  }
}