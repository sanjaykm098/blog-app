import { Controller, Get, Render } from '@nestjs/common';

@Controller('')
export class FrontController {
  constructor() {
    console.log('FrontController');
  }

  @Get()
  @Render('homepage')
  homePage() {
    return { message: 'Hello world! This is the homepage.', title: 'Homepage' };
  }

  @Get('users')
  @Render('users')
  usersPage() {
    return { title: 'Users' };
  }

  @Get('blogs')
  @Render('blogs')
  blogsPage() {
    return { message: 'Hello world! This is the blogs page.', title: 'Blogs' };
  }
}
