import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";

@Module({
  imports: [UserModule], // 依赖 User 模块
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
