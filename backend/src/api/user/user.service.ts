/* eslint-disable prettier/prettier */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./user.schema";
import { RegisterDto } from "../auth/dto/register.dto";
import { UserRole } from "../auth/dto/roles.enum";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll() {
    return await this.userModel.find().exec();
  }

  async create(dto: RegisterDto) {
    const { username, password, name, role } = dto;

    const exists = await this.userModel.exists({ username });
    if (exists) throw new BadRequestException("Username already exists");

    return await this.userModel.create({
      username,
      password,
      name,
      role: role ?? UserRole.SEARCHER,
    });
  }

  async validateUser(username: string, password: string) {
    const user = await this.userModel.findOne({ username }).select("+password").exec();
    if (!user) throw new NotFoundException("Invalid credentials");
    
    console.log("Found user: ", user);

    if (!user) {
      console.log('User not found');
      throw new NotFoundException("Invalid credentials");
    }
    
    console.log('User password vs provided password:', user.password, 'vs', password);

    if (user.password !== password)
      throw new BadRequestException("Invalid credentials");
    return user;
  }

  async findByUsername(username: string) {
    return await this.userModel.findOne({ username });
  }

  async updateRoleByUsername(username: string, role: string) {
    return await this.userModel.findOneAndUpdate(
      { username },
      { role },
      { new: true },
    );
  }
}
