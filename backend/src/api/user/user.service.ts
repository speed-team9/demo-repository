/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { User, UserDocument } from "./user.schema";
import { RegisterDto } from "../auth/dto/register.dto";
import { UserRole } from "../auth/dto/roles.enum";
import * as bcrypt from "bcryptjs";

export type SafeUser = {
  _id: Types.ObjectId;
  username: string;
  name: string;
  role: UserRole;
};

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: RegisterDto): Promise<SafeUser> {
    const { username, password, name, role } = dto;

    const exists = await this.userModel.exists({ username });
    if (exists) throw new BadRequestException("Username already exists");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const created = await this.userModel.create({
      username,
      password: hashedPassword,
      name,
      role: role ?? UserRole.SEARCHER,
    });

    return this.sanitizeUser(created);
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<SafeUser | null> {
    const user = await this.userModel.findOne({ username }).select("+password");
    if (!user) throw new NotFoundException("Invalid credentials");

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new BadRequestException("Invalid credentials");

    return this.sanitizeUser(user);
  }

  async findById(id: string): Promise<SafeUser | null> {
    const user = await this.userModel.findById(id);
    return user ? this.sanitizeUser(user) : null;
  }

  async findByUsername(username: string): Promise<SafeUser | null> {
    const user = await this.userModel.findOne({ username });
    return user ? this.sanitizeUser(user) : null;
  }

  private sanitizeUser(doc: UserDocument): SafeUser {
    const { password, ...userWithoutPassword } = doc.toObject();
    return {
      _id: userWithoutPassword._id,
      username: userWithoutPassword.username,
      name: userWithoutPassword.name,
      role: userWithoutPassword.role,
    };
  }
}
