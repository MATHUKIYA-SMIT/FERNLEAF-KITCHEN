import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard
  implements CanActivate
{
  constructor(
    private readonly jwt_service: JwtService
  ) {}

  async canActivate(
    context: ExecutionContext
  ): Promise<boolean> {
    const request =
      context
        .switchToHttp()
        .getRequest();

    const token =
      request.cookies?.access_token;

    if (!token) {
      throw new UnauthorizedException(
        "Authentication required."
      );
    }

    try {
      const payload =
        await this.jwt_service.verifyAsync(
          token
        );

      request.user = payload;

      return true;
    } catch {
      throw new UnauthorizedException(
        "Invalid or expired token."
      );
    }
  }
}