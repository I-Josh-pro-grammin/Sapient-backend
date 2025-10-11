import { BadRequestException, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(
    private adminService:AdminService
  ) {}
  @Post("/notes/:id")
  approveNotes(@Param("id") id: string) {
    const notesId = Number(id);
    if(!notesId) {
      throw new BadRequestException("notes id should be a number");
    }

    return this.adminService.approveNotes(notesId);
  }

  @Get("notes/approved/All")
  getApprovedNotes(){
    return this.adminService.viewApprovedNotes()
  }

  @Get("/students/All")
  getStudents(){
      return this.adminService.getAllStudents()
  }

  @Patch("/students/:id/approve")
  approveStudents(@Param('id') id:string ){
    const userId = Number(id)
    if(!userId){
      throw new BadRequestException("User Id should be a number")
    }
    return this.adminService.approveStudent(userId)
  }
}

