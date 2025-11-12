/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ArticleService } from "../api/articles/article.service";
import { Article, ArticleDocument } from "../api/articles/article.scheme";
import { CreateArticleDto } from "../api/articles/create-article.dto";
import { NotFoundException } from "@nestjs/common";

// Helper to create a mock query object with exec
const createMockQuery = (result: any) => ({
  exec: jest.fn().mockResolvedValue(result),
  lean: jest.fn().mockReturnThis(),
});

describe("ArticleService - Core Methods", () => {
  let service: ArticleService;
  let model: Model<ArticleDocument>;

  const testArticleDto: CreateArticleDto = {
    title: "Test Article",
    authors: ["Test Author"],
    source: "Test Source",
    pubyear: "2024",
    doi: "10.1234/test",
    claim: "Test claim",
    status: "pending",
    reviewstatus: "pending",
    submitterUsername: "test-user",
  };

  const baseArticle: Article = {
    title: "Test Article",
    authors: ["Test Author"],
    source: "Test Source",
    pubyear: "2024",
    doi: "10.1234/test",
    claim: "Test claim",
    submitterUsername: "test-user",
    reviewStatus: "pending",
    status: "pending",
  };

  const fullArticle = {
    ...baseArticle,
    _id: "test-id" as any,
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
  };

  beforeEach(async () => {
    // 创建一个可调用的 mock 函数
    const mockModel = jest.fn().mockImplementation(() => ({
      save: jest.fn(),
    })) as unknown as Model<ArticleDocument>;
    
    // 添加 Model 的静态方法
    mockModel.find = jest.fn();
    mockModel.findByIdAndUpdate = jest.fn();
    mockModel.findOneAndUpdate = jest.fn();
    mockModel.findByIdAndDelete = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        {
          provide: getModelToken(Article.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
    model = module.get(getModelToken(Article.name));
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("should return all articles", async () => {
      const mockQuery = createMockQuery([fullArticle]);
      (model.find as jest.Mock).mockReturnValue(mockQuery);

      const result = await service.findAll();

      expect(model.find).toHaveBeenCalled();
      expect(mockQuery.exec).toHaveBeenCalled();
      expect(result).toEqual([fullArticle]);
    });
  });

  describe("create", () => {
    it("should create a new article successfully", async () => {
      const mockSave = jest.fn().mockResolvedValue(fullArticle);
      (model as unknown as jest.Mock).mockImplementationOnce(() => ({
        save: mockSave,
      }));

      const result = await service.create(testArticleDto);

      expect(model).toHaveBeenCalledWith({
        title: testArticleDto.title,
        authors: testArticleDto.authors,
        source: testArticleDto.source,
        pubyear: testArticleDto.pubyear,
        doi: testArticleDto.doi || "",
        claim: testArticleDto.claim || "",
        status: testArticleDto.status || "pending",
        submitTime: expect.any(Date),
        reviewStatus: "pending",
      });
      expect(result).toEqual(fullArticle);
    });

    it("should throw error when creation fails", async () => {
      const errorMsg = "DB connection error";
      const mockSave = jest.fn().mockRejectedValue(new Error(errorMsg));
      (model as unknown as jest.Mock).mockImplementationOnce(() => ({
        save: mockSave,
      }));

      await expect(service.create(testArticleDto)).rejects.toThrow(
        `Unable to add this article: ${errorMsg}`,
      );
    });
  });

  // ... 其他测试保持不变（update, findBySubmitterUsername 等）
  describe("update", () => {
    it("should update article fields", async () => {
      const updateData = { title: "Updated Title", status: "accepted" };
      const updatedArticle = { ...fullArticle, ...updateData };
      const mockQuery = createMockQuery(updatedArticle);
      (model.findByIdAndUpdate as jest.Mock).mockReturnValue(mockQuery);

      const result = await service.update("test-id", updateData);

      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        "test-id",
        updateData,
        { new: true },
      );
      expect(mockQuery.exec).toHaveBeenCalled();
      expect((result as any).title).toBe("Updated Title");
      expect((result as any).status).toBe("accepted");
    });
  });

  describe("findBySubmitterUsername", () => {
    it("should return articles by submitter username", async () => {
      const username = "test-user";
      const mockQuery = createMockQuery([fullArticle]);
      (model.find as jest.Mock).mockReturnValue(mockQuery);

      const result = await service.findBySubmitterUsername(username);

      expect(model.find).toHaveBeenCalledWith({ submitterUsername: username });
      expect(mockQuery.exec).toHaveBeenCalled();
      expect(result).toEqual([fullArticle]);
    });
  });

  describe("searchArticles", () => {
    it("should search articles by title", async () => {
      const query = { title: "Test" };
      const mockQuery = createMockQuery([fullArticle]);
      (model.find as jest.Mock).mockReturnValue(mockQuery);

      const result = await service.searchArticles(query);

      expect(model.find).toHaveBeenCalledWith({
        title: { $regex: query.title, $options: "i" },
      });
      expect(result).toEqual([fullArticle]);
    });

    it("should search articles by author", async () => {
      const query = { author: "Author" };
      const mockQuery = createMockQuery([fullArticle]);
      (model.find as jest.Mock).mockReturnValue(mockQuery);

      const result = await service.searchArticles(query);

      expect(model.find).toHaveBeenCalledWith({
        authors: { $regex: query.author, $options: "i" },
      });
      expect(result).toEqual([fullArticle]);
    });
  });

  describe("reviewArticleByTitle", () => {
    it("should review article by title (accept)", async () => {
      const title = "Test Article";
      const reviewResult = { ...fullArticle, reviewStatus: "accepted" };
      const mockQuery = createMockQuery(reviewResult);
      (model.findOneAndUpdate as jest.Mock).mockReturnValue(mockQuery);

      const result = await service.reviewArticleByTitle(title, "accepted");

      expect(model.findOneAndUpdate).toHaveBeenCalledWith(
        { title },
        { reviewStatus: "accepted", reviewedAt: expect.any(Date) },
        { new: true, lean: true },
      );
      expect((result as any).reviewStatus).toBe("accepted");
    });

    it("should throw NotFoundException if title not found", async () => {
      const title = "Non-existent Title";
      const mockQuery = createMockQuery(null);
      (model.findOneAndUpdate as jest.Mock).mockReturnValue(mockQuery);

      await expect(
        service.reviewArticleByTitle(title, "rejected"),
      ).rejects.toThrow(
        new NotFoundException(`Article with title "${title}" not found`),
      );
    });
  });

  describe("findByReviewStatus", () => {
    it("should return articles with 'pending' status", async () => {
      const status = "pending";
      const mockQuery = createMockQuery([fullArticle]);
      (model.find as jest.Mock).mockReturnValue(mockQuery);

      const result = await service.findByReviewStatus(status);

      expect(model.find).toHaveBeenCalledWith({ reviewStatus: status });
      expect(result).toEqual([fullArticle]);
    });

    it("should return articles with 'accepted' status", async () => {
      const status = "accepted";
      const acceptedArticle = { ...fullArticle, reviewStatus: "accepted" };
      const mockQuery = createMockQuery([acceptedArticle]);
      (model.find as jest.Mock).mockReturnValue(mockQuery);

      const result = await service.findByReviewStatus(status);

      expect(model.find).toHaveBeenCalledWith({ reviewStatus: status });
      expect((result[0] as any).reviewStatus).toBe("accepted");
    });
  });
});
