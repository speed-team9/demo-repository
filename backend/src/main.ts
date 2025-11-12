import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({
    origin: ["http://localhost:3000", /^https:\/\/.*\.vercel\.app$/],
    credentials: false,
  });

  const port = process.env.PORT || 8082;
  await app.listen(port);
  console.log(`Backend listening on ${port}`);
}
void bootstrap();
