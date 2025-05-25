/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/guard';
import { BookmarkService } from './bookmark.service';
import { GetUser } from 'src/decorator';
import { createBookmarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor( private bookmarkService: BookmarkService ){}
  @Post(':id')
  createBookmark(
    @GetUser('id') userId: number,
    @Body() dto: createBookmarkDto
) {
    
  }
  
  @Get('id')
  getBookmarkById(
    @GetUser('id') userId: number,
    @Param('id') bookmarkId: number
  ) {
    
  }
  
  @Get()
  getBookmarks(
    @GetUser('id') userId: number,
    @Param('id') bookmarkId: number
  ) {

  }
  
  @Patch()
  editBookmarksById(
    @GetUser('id') userId: number,
    @Param('id') bookmarkId: number
  ) {
    
  }
  
  @Delete()
  deleteBookmarksById(
    @GetUser('id') userId: number,
    @Param('id') bookmarkId: number
  ) {
    
  }
}
