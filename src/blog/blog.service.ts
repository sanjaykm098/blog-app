import { HttpException, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from 'src/schemas/Blog.schema';
import { Model } from 'mongoose';

@Injectable()
export class BlogService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}
  async create(createBlogDto: CreateBlogDto) {
    const blog = await this.blogModel.create(createBlogDto);
    blog.user = undefined;
    const data = {
      blog,
      statusCode: 201,
      message: 'Blog created successfully!',
    };

    return data;
  }

  async findAll(userId: string) {
    const blogs = await this.blogModel
      .find({ user: userId })
      .populate('user', 'name email');
    const data = {
      blogs,
      statusCode: 200,
      message: 'Blogs found',
    };
    return data;
  }

  async findOne(id: string, userId: string) {
    const blog = await this.blogModel
      .findOne({ _id: id, user: userId })
      .populate('user', 'name email');
    if (!blog) {
      throw new HttpException('Blog not found', 404);
    }
    const data = {
      blog,
      statusCode: 200,
      message: 'Blog found',
    };
    return data;
  }

  async update(id: string, updateBlogDto: UpdateBlogDto, userId: string) {
    const blog = await this.blogModel.findOne({ _id: id, user: userId });
    if (!blog) {
      throw new HttpException('Blog not found', 404);
    }
    const updatedBlog = await this.blogModel
      .findByIdAndUpdate(id, updateBlogDto, {
        new: true,
      })
      .populate('user', 'name email');
    const data = {
      blog: updatedBlog,
      statusCode: 200,
      message: 'Blog updated',
    };

    return data;
  }

  async remove(id: string, userId: string) {
    const blog = await this.blogModel.findOne({ _id: id, user: userId });
    if (!blog) {
      throw new HttpException('Blog not found', 404);
    }

    await this.blogModel.findByIdAndDelete(id);
    const data = {
      statusCode: 200,
      message: 'Blog deleted',
    };

    return data;
  }
}
