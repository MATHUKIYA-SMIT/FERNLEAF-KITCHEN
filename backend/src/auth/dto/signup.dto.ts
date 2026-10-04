import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from "class-validator";

export enum UserRole {
  Admin = "Admin",
  Kitchen = "Kitchen",
  Dispatch = "Dispatch",
  Driver = "Driver",
}

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  confirm_password: string;

  @IsEnum(UserRole)
  role: UserRole;
}