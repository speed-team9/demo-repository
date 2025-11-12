// src/api/user/user.module.ts

import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./user.schema";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";

@Module({
  imports: [
    // 注册 MongoDB 模型
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService], // 导出供 Auth 模块使用
})
export class UserModule {}
