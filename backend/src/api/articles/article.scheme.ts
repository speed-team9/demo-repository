import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ArticleDocument = HydratedDocument<Article>;

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
@Schema()
export class Article {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Prop({ required: true })
  title: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Prop({ required: true, type: [String] })
  authors: string[];

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Prop({ required: true })
  source: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Prop({ required: true })
  pubyear: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Prop()
  doi: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Prop()
  claim: string;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
export const ArticleSchema = SchemaFactory.createForClass(Article);
