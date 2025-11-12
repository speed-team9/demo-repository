import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ArticleModule } from "./api/articles/article.module";
import { AuthModule } from "./api/auth/auth.module";
import { UserModule } from "./api/user/user.module";
import { ConfigModule } from "@nestjs/config";

const DB_URI =
  "mongodb+srv://speed_rw:boJMdQgj0ki6H3r0@cluster0.pr6jtjs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(DB_URI),
    ArticleModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
