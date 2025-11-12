import { IsString, MinLength, IsNotEmpty } from "class-validator";

export class LoginDto {
  @IsString({ message: "Username must be a string" })
  @IsNotEmpty({ message: "Username cannot be empty" })
  username: string;

  @IsString({ message: "Password must be a string" })
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  @IsNotEmpty({ message: "Password cannot be empty" })
  password: string;
}
