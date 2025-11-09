import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ArticleModule } from "./api/articles/article.module";

const DB_URI =
  "mongodb+srv://speed_rw:boJMdQgj0ki6H3r0@cluster0.pr6jtjs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

@Module({
  imports: [MongooseModule.forRoot(DB_URI), ArticleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
