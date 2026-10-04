import { IsNotEmpty, IsString } from "class-validator";

export class DeleteCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}