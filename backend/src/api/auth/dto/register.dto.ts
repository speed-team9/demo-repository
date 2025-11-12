import {
  IsString,
  MinLength,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from "class-validator";
import { UserRole } from "./roles.enum";

export class RegisterDto {
  @IsString({ message: "Username must be a string" })
  @IsNotEmpty({ message: "Username cannot be empty" })
  username: string;

  @IsString({ message: "Password must be a string" })
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  @IsNotEmpty({ message: "Password cannot be empty" })
  password: string;

  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name cannot be empty" })
  name: string;

  @IsEnum(UserRole, {
    message: `Role must be one of: ${Object.values(UserRole).join(", ")}`,
  })
  @IsOptional()
  role?: UserRole;
}
