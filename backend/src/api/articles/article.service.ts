/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// article.service.ts

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { BadRequestException, Injectable } from "@nestjs/common";
import { Article } from "./article.scheme";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateArticleDto } from "./create-article.dto";
import { NotFoundException } from "@nestjs/common";

type UpdateArticleDto = Partial<
  CreateArticleDto & {
    submitterId?: string;
    submitterName?: string;
    submitterUsername?: string;
    reviewStatus?: "pending" | "accepted" | "rejected";
    reviewReason?: string;
    reviewedAt?: Date;
    keyInsights?: string;
    tags?: string[];
    analyzedAt?: Date;
  }
>;

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
  ) {}

  test(): string {
    return "article route testing";
  }

  async findAll(): Promise<Article[]> {
    return await this.articleModel.find().exec();
  }

  async findOne(id: string): Promise<Article> {
    const article = await this.articleModel.findById(id).lean().exec();
    if (!article) throw new NotFoundException(`Article ${id} not found`);
    return article;
  }

  async create(createArticleDto: any): Promise<Article> {
    try {
      console.log("Service received:", createArticleDto);

      const articleData = {
        title: createArticleDto.title,
        authors: createArticleDto.authors,
        source: createArticleDto.source,
        pubyear: createArticleDto.pubyear,
        doi: createArticleDto.doi || "",
        claim: createArticleDto.claim || "",
        status: createArticleDto.status || "pending",
        submitTime: new Date(),
        reviewStatus: "pending",
      };

      console.log("Final article data:", articleData);

      const createdArticle = new this.articleModel(articleData);
      const savedArticle = await createdArticle.save();
      console.log("Article created successfully");
      return savedArticle;
    } catch (error: any) {
      console.error("Create error:", error.message);
      throw new Error("Unable to add this article: " + error.message);
    }
  }

  async update(id: string, updateData: UpdateArticleDto) {
    console.log("=== SERVICE UPDATE START ===");
    console.log("Service update - ID:", id);
    console.log("Service update - Data:", updateData);

    try {
      const result = await this.articleModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .exec();

      console.log("Service update - MongoDB result:", result);

      if (!result) {
        console.log("Service update - Article not found");
      }

      console.log("=== SERVICE UPDATE END ===");
      return result;
    } catch (error) {
      console.error("Service update error:", error);
      console.log("=== SERVICE UPDATE END WITH ERROR ===");
      throw error;
    }
  }

  async delete(id: string) {
    const deletedArticle = await this.articleModel.findByIdAndDelete(id).exec();
    return deletedArticle;
  }

  async findBySubmitterUsername(username: string): Promise<Article[]> {
    return this.articleModel.find({ submitterUsername: username }).exec();
  }

  async searchArticles(query: {
    title?: string;
    author?: string;
  }): Promise<Article[]> {
    const filter: any = {};
    if (query.title) {
      filter.title = { $regex: query.title, $options: "i" };
    }
    if (query.author) {
      filter.authors = { $regex: query.author, $options: "i" };
    }
    return this.articleModel.find(filter).exec();
  }

  async reviewArticle(
    id: string,
    status: "accepted" | "rejected",
    reason?: string,
  ): Promise<Article> {
    const updatedArticle = await this.articleModel
      .findByIdAndUpdate(
        id,
        {
          reviewStatus: status,
          reviewReason: reason,
          reviewedAt: new Date(),
        },
        { new: true, lean: true },
      )
      .exec();
    if (!updatedArticle) {
      throw new NotFoundException(`Article ${id} not found`);
    }
    return updatedArticle as Article;
  }

  async reviewArticleByTitle(
    title: string,
    status: "accepted" | "rejected",
    reason?: string,
  ): Promise<Article> {
    const updatedArticle = await this.articleModel
      .findOneAndUpdate(
        { title: title },
        {
          reviewStatus: status,
          reviewReason: reason,
          reviewedAt: new Date(),
        },
        { new: true, lean: true },
      )
      .exec();

    if (!updatedArticle) {
      throw new NotFoundException(`Article with title "${title}" not found`);
    }
    return updatedArticle as Article;
  }

  async findByReviewStatus(
    status: "pending" | "accepted" | "rejected",
  ): Promise<Article[]> {
    return this.articleModel.find({ reviewStatus: status }).exec();
  }

  async updateRatingByTitle(title: string, rating: number) {
    if (!title || typeof title !== "string") {
      throw new BadRequestException("Valid title is required");
    }
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      throw new BadRequestException("Rating must be a number between 1 and 5");
    }

    const updatedArticle = await this.articleModel
      .findOneAndUpdate({ title }, { rating }, { new: true })
      .exec();

    if (!updatedArticle) {
      throw new NotFoundException(`Article with title "${title}" not found`);
    }

    return updatedArticle;
  }
}
