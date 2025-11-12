import { HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { UserRole } from "./dto/roles.enum";
import { User } from "../user/user.schema";

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    console.log("接收的参数：", { username, password });

    const user = (await this.userService.findByUsername(
      username,
    )) as User | null;
    console.log("查询到的用户：", user); // 打印查询结果（看是否有 password 字段）
    console.log("用户密码 vs 传递密码：", user?.password, "vs", password); // 比对两个值

    if (!user)
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        error: "Invalid username or password",
        submitted: { username, password },
      });
    if (user.password !== password)
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        error: "Invalid username or password",
        submitted: { username, password },
      });

    return {
      userId: user._id?.toString(),
      username: user.username,
      name: user.name,
      role: user.role,
    };
  }

  async register(registerDto: RegisterDto) {
    const userData = {
      ...registerDto,
      role: registerDto.role ?? UserRole.SEARCHER,
    };

    const createdUser = (await this.userService.create(userData)) as User;

    return {
      userId: createdUser._id?.toString(),
      username: createdUser.username,
      name: createdUser.name,
      role: createdUser.role,
    };
  }
}
