import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { GetUserId } from 'src/check-auth/user-id';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('api/blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {
    console.log('BlogController');
  }

  @Post()
  create(
    @Body(ValidationPipe) createBlogDto: CreateBlogDto,
    @GetUserId() userId: string,
  ) {
    createBlogDto.user = userId;
    return this.blogService.create(createBlogDto);
  }

  @Get()
  findAll(@GetUserId() userId: string) {
    return this.blogService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUserId() userId: string) {
    return this.blogService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateBlogDto: UpdateBlogDto,
    @GetUserId() userId: string,
  ) {
    updateBlogDto.user = userId;
    return this.blogService.update(id, updateBlogDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUserId() userId: string) {
    return this.blogService.remove(id, userId);
  }
}
