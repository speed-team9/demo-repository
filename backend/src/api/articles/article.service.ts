import { Injectable } from "@nestjs/common";
import { Article } from "./article.scheme";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateArticleDto } from "./create-article.dto";
import { NotFoundException } from "@nestjs/common";

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

  // async create(createArticleDto: CreateArticleDto) {
  //   return await this.articleModel.create(createArticleDto);
  // }

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    try {
      const createdArticle = new this.articleModel(createArticleDto);
      return await createdArticle.save();
    } catch (error) {
      console.error("Error creating article:", error);
      throw new Error("Unable to add this article");
    }
  }

  async update(id: string, createArticleDto: CreateArticleDto) {
    return await this.articleModel
      .findByIdAndUpdate(id, createArticleDto)
      .exec();
  }

  async delete(id: string) {
    const deletedArticle = await this.articleModel.findByIdAndDelete(id).exec();
    return deletedArticle;
  }
}
