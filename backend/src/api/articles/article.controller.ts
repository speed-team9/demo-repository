/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from "@nestjs/common";
import { ArticleService } from "./article.service";
import { CreateArticleDto } from "./create-article.dto";

type ReviewStatus = "pending" | "accepted" | "rejected";

@Controller("api/articles")
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Get()
  async findAll() {
    return this.articleService.findAll();
  }

  @Get("search")
  async search(
    @Query("title") title?: string,
    @Query("author") author?: string,
  ) {
    return this.articleService.searchArticles({ title, author });
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.articleService.findOne(id);
  }

  @Post()
  async create(@Body() body: any) {
    console.log("Controller create - Received body:", body);

    const createArticleDto: CreateArticleDto = {
      title: body.title,
      authors: body.authors,
      source: body.source,
      pubyear: body.pubyear,
      doi: body.doi,
      claim: body.claim,
      status: body.status,
    };

    console.log("Controller create - Processed DTO:", createArticleDto);

    return this.articleService.create(createArticleDto);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() updateData: any) {
    console.log("=== BACKEND UPDATE START ===");
    console.log("Update request for ID:", id);
    console.log("Update data received:", updateData);

    try {
      const result = await this.articleService.update(id, updateData);
      console.log("Update successful, result:", result);
      console.log("=== BACKEND UPDATE END ===");
      return result;
    } catch (error) {
      console.error("Backend update error:", error);
      console.log("=== BACKEND UPDATE END WITH ERROR ===");
      throw error;
    }
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.articleService.delete(id);
  }

  @Get("submitter/articles")
  async findBySubmitterUsername(@Query("username") username: string) {
    return this.articleService.findBySubmitterUsername(username);
  }

  @Post(":id/review")
  async review(
    @Param("id") id: string,
    @Body() data: { status: "accepted" | "rejected"; reason?: string },
  ) {
    return this.articleService.reviewArticle(id, data.status, data.reason);
  }

  @Post("review/title")
  async reviewByTitle(
    @Body()
    data: {
      title: string;
      status: "accepted" | "rejected";
      reason?: string;
    },
  ) {
    return this.articleService.reviewArticleByTitle(
      data.title,
      data.status,
      data.reason,
    );
  }

  @Get("review/status")
  async findByReviewStatus(@Query("status") status: ReviewStatus) {
    return this.articleService.findByReviewStatus(status);
  }

  @Post(":id/analyze")
  async analyze(
    @Param("id") id: string,
    @Body() data: { keyInsights: string },
  ) {
    return this.articleService.update(id, { keyInsights: data.keyInsights });
  }
}
