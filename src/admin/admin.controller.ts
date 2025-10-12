import { BadRequestException, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(
    private adminService:AdminService
  ) {}
  @Patch("/notes/:id/approve")
  approveNotes(@Param("id") id: string) {
    const notesId = Number(id);
    if(!notesId){
      throw new BadRequestException("notes id should be a number");
    }

    return this.adminService.approveNotes(notesId);
  }

  @Get("notes/approved/all")
  getApprovedNotes(){
    return this.adminService.viewApprovedNotes()
  }

  @Get("/students/all")
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

  @Get("/activity-logs")
  getActivity(){
      return this.adminService.getActivityLogs()
  }
}

