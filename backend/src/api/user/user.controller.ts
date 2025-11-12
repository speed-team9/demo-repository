import { Controller, Get, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { AuthGuard } from "../../common/guards/auth.guard";
import { User } from "./user.schema";

@Controller("api/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 获取当前登录用户信息
   * 需登录才能访问（AuthGuard 校验会话）
   */
  @Get("me")
  @UseGuards(AuthGuard)
  async getCurrentUser(@CurrentUser() user: User) {
    return {
      message: "查询成功",
      data: user,
    };
  }
}
