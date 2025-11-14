// create-article.dto.ts

export class CreateArticleDto {
  title: string;
  authors: string[];
  source: string;
  pubyear: string;
  doi?: string;
  claim?: string;
  status?: string;
  reviewstatus?: string;
  submitterId?: string;
  submitterName?: string;
  submitterUsername?: string;
  rating?: string;
}
