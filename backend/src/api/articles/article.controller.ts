import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  Delete,
} from "@nestjs/common";
import { ArticleService } from "./article.service";
import { CreateArticleDto } from "./create-article.dto";

type ReviewStatus = "pending" | "accepted" | "rejected";

@Controller("api/articles")
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Get() async findAll() {
    return this.articleService.findAll();
  }
  @Get(":id") async findOne(@Param("id") id: string) {
    return this.articleService.findOne(id);
  }
  @Post() async create(@Body() dto: CreateArticleDto) {
    return this.articleService.create(dto);
  }
  @Put(":id") async update(
    @Param("id") id: string,
    @Body() dto: CreateArticleDto,
  ) {
    return this.articleService.update(id, dto);
  }
  @Delete(":id") async delete(@Param("id") id: string) {
    return this.articleService.delete(id);
  }

  @Post(":id/review") async review(
    @Param("id") id: string,
    @Body() data: { status: ReviewStatus; reason?: string },
  ) {
    return this.articleService.update(id, {
      reviewStatus: data.status,
      reviewReason: data.reason,
    });
  }

  @Post(":id/analyze") async analyze(
    @Param("id") id: string,
    @Body() data: { keyInsights: string },
  ) {
    return this.articleService.update(id, { keyInsights: data.keyInsights });
  }
}
