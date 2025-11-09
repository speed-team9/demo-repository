import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ArticleDocument = HydratedDocument<Article>;

@Schema()
export class Article {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, type: [String] })
  authors: string[];

  @Prop({ required: true })
  source: string;

  @Prop({ required: true })
  pubyear: string;

  @Prop()
  doi: string;

  @Prop()
  claim: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
