/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("api/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Put(":username/role")
  async updateRole(
    @Param("username") username: string,
    @Body() data: { role: string },
  ) {
    console.log(`Updating role for user: ${username}, new role: ${data.role}`);
    const user = await this.userService.updateRoleByUsername(
      username,
      data.role,
    );
    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
    console.log(`User role updated successfully:`, user);
    return user;
  }
}
