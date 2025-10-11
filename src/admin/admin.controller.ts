import { BadRequestException, Controller, Param, Post } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(
    private adminService = AdminService,
  ) {}
  @Post("/notes/:id")
  approveNotes(@Param("id") id: string) {
    const notesId = Number(id);
    if(!notesId) {
      throw new BadRequestException("notes id should be a number");
    }

    return this.adminService.approveNotes(notesId);
  }
}
