import { BadRequestException, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AdminGuard, JwtGuard } from '../guard';

@Controller('admin')
export class AdminController {
  constructor(
    private AdminService = AdminService,
  ) {}

  @UseGuards(JwtGuard, AdminGuard)
  @Post("/notes/:id")
  approveNotes(@Param("id") id: string) {
    const notesId = Number(id);
    if(!notesId) {
      throw new BadRequestException("notes id should be a number");
    }

    return this.AdminService.approveNotes(notesId);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Post("/notes/:id")
  rejectNotes(@Param("id") id: string) {
    const notesId = Number(id);
    if(!notesId) {
      throw new BadRequestException("notes id should be a number");
    }

    return this.AdminService.approveNotes(notesId);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Get("/notes/approved")
  getApprovedNotes() {
    return  this.AdminService.getApprovedNotes();
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Get("/notes/pending")
  getPendingNotes() {
    return this.AdminService.getPendingNotes();
  }

}
