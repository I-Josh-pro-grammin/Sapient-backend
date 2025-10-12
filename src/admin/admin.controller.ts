import { BadRequestException, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminGuard, JwtGuard } from '../guard';

@Controller('admin')
export class AdminController {
  constructor(
    private AdminService = AdminService,
  ) {}

  //Approve notes
  @UseGuards(JwtGuard, AdminGuard)
  @Patch("/notes/:id")
  approveNotes(@Param("id") id: string) {
    const notesId = Number(id);
    if(!notesId){
      throw new BadRequestException("notes id should be a number");
    }

    return this.AdminService.approveNotes(notesId);
  }

  //Reject notes
  @UseGuards(JwtGuard, AdminGuard)
  @Patch("/notes/:id")
  rejectNotes(@Param("id") id: string) {
    const notesId = Number(id);
    if(!notesId) {
      throw new BadRequestException("notes id should be a number");
    }

    return this.AdminService.approveNotes(notesId);
  }

  //Get approved notes
  @UseGuards(JwtGuard, AdminGuard)
  @Get("/notes/approved")
  getApprovedNotes() {
    return  this.AdminService.getApprovedNotes();
  }
  //Get pending notes
  @UseGuards(JwtGuard, AdminGuard)
  @Get("/notes/pending")
  getPendingNotes() {
    return this.AdminService.getPendingNotes();
  }

  // Get all students
  @Get("/students/all")
  getStudents() {
    return this.AdminService.getAllStudents();
  }

  //Get approved students
  @Get("/students/approved/all")
  getApprovedStudents(){
    return this.AdminService.getApprovedStudents()
  }

  //Get pending students
  @Get("/students/pending/all")
  getPendingStudents(){
    return this.AdminService.getPendingStudents()
  }

  // Approve a student by ID
  @Patch("/students/:id/approve")
  approveStudents(@Param('id') id: string) {
    const userId = Number(id);
    if (!userId) {
      throw new BadRequestException("User ID should be a number");
    }
    return this.AdminService.approveStudent(userId);
  }

  // Get activity logs
  @Get("/activity-logs")
  getActivity() {
    return this.AdminService.getActivityLogs();
  }

}

