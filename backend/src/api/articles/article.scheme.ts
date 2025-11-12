import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ArticleDocument = HydratedDocument<Article>;

@Schema({ timestamps: true })
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

  @Prop()
  submitterId?: string;

  @Prop()
  submitterName?: string;

  @Prop({ enum: ["pending", "accepted", "rejected"], default: "pending" })
  reviewStatus?: "pending" | "accepted" | "rejected";

  @Prop()
  reviewReason?: string;

  @Prop()
  reviewedAt?: Date;

  @Prop()
  keyInsights?: string;

  @Prop([String])
  tags?: string[];

  @Prop()
  analyzedAt?: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
