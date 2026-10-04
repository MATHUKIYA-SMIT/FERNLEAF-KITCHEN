import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";

export enum CompanyType {
  Partner = "Partner",
  Enterprise = "Enterprise",
  Standard = "Standard",
}

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(CompanyType)
  type: CompanyType;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsEmail()
  billing_email: string;
}