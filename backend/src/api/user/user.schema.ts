/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, Types } from "mongoose";
import * as bcrypt from "bcryptjs";
import { UserRole } from "../auth/dto/roles.enum";
// import { Type } from "class-transformer";

// MongoDB
// export type UserDocument = User & Document;
export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop({
    required: [true, "Username is not allowed by empty."],
    unique: [true, "Username has already exsist."],
    trim: true,
    maxlength: [20, "The length of username shoud be limited under 20 chars."],
  })
  username: string;

  @Prop({
    required: [true, "Password is not allowed be empty."],
    select: false,
  })
  password: string;

  @Prop({
    required: [true, "Name should not be empty."],
    trim: true,
  })
  name: string;

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.SEARCHER,
  })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt); // 加密密码
    next();
  } catch (error) {
    next(error as Error);
  }
});

UserSchema.methods.comparePassword = async function (
  this: UserDocument,
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};
