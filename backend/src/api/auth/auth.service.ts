import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from "bcryptjs";
import { UserRole } from "./dto/roles.enum";
import { User } from "../user/user.schema";

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = (await this.userService.findByUsername(
      username,
    )) as User | null;

    if (!user) throw new UnauthorizedException("Invalid username or password");
    if (!user.password)
      throw new UnauthorizedException("User password not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      throw new UnauthorizedException("Invalid username or password");

    return {
      userId: user._id?.toString() ?? "",
      username: user.username ?? "",
      name: user.name ?? "",
      role: user.role ?? UserRole.SEARCHER,
    };
  }

  async register(registerDto: RegisterDto) {
    const userData = {
      ...registerDto,
      role: registerDto.role ?? UserRole.SEARCHER,
    };

    const createdUser = (await this.userService.create(userData)) as User;

    return {
      userId: createdUser._id?.toString() ?? "",
      username: createdUser.username ?? "",
      name: createdUser.name ?? "",
      role: createdUser.role ?? UserRole.SEARCHER,
    };
  }
}
