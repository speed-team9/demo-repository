/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from "@nestjs/common";
import { Article } from "./article.scheme";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateArticleDto } from "./create-article.dto";
import { NotFoundException } from "@nestjs/common";

type UpdateArticleDto = Partial<
  CreateArticleDto & {
    submitterId?: string;
    submitterName?: string;
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

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    try {
      const createdArticle = new this.articleModel(createArticleDto);
      return await createdArticle.save();
    } catch (error) {
      console.error("Error creating article:", error);
      throw new Error("Unable to add this article");
    }
  }

  async update(id: string, updateData: UpdateArticleDto) {
    return await this.articleModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async delete(id: string) {
    const deletedArticle = await this.articleModel.findByIdAndDelete(id).exec();
    return deletedArticle;
  }

  async findBySubmitterId(submitterId: string): Promise<Article[]> {
    return this.articleModel.find({ submitterId }).exec();
  }

  async searchArticles(query: {
    keyword?: string;
    source?: string;
    pubyear?: string;
  }): Promise<Article[]> {
    const filter: any = {};
    if (query.keyword) {
      filter.$or = [
        { title: { $regex: query.keyword, $options: "i" } },
        { authors: { $regex: query.keyword, $options: "i" } },
        { claim: { $regex: query.keyword, $options: "i" } },
      ];
    }
    if (query.source) filter.source = query.source;
    if (query.pubyear) filter.pubyear = query.pubyear;
    return this.articleModel.find(filter).exec();
  }
}
