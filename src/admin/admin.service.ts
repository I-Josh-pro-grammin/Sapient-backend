import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Note, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  //Approve notes
  async approveNotes(notes_id: number) {
    return await this.prisma.note.update({
      where: {
        id: notes_id
      },
      data: {
        status: "APPROVED"
      }
    })
  }

  // View all approved notes
  async viewApprovedNotes():Promise<{notes:Note[]}>{
      const notes = await this.prisma.note.findMany({
        where:{ status: "APPROVED" }
      })

      return { notes }
  }

  //Get all students in the school
  async getAllStudents():Promise<{students:User[]}>{
    try {
      const students = await this.prisma.user.findMany({
      where:{ role:"STUDENT" },
      orderBy:{ createdAt:'desc' }
      })
    return { students }
    } catch (error) {
       throw new InternalServerErrorException("Could not get students")
    }
    }

  //Get all approved students
  async getApprovedStudents():Promise<{students:User[]}>{
     const approvedStudents = await this.prisma.user.findMany({
        where: { role:"STUDENT", status:"APPROVED" },
        orderBy: { createdAt:'desc' }
     })
     return { students:approvedStudents }
  }

//View all pending students
async getPendingStudents():Promise<{students:User[]}>{
  const pendingStudents = await this.prisma.user.findMany({
     where: { role:'STUDENT', status:'PENDING' },
     orderBy: { createdAt: 'desc' }
  })

  return { students:pendingStudents }
}

// Approve a student
  async approveStudent(userId:number):Promise<{message:string,updatedStudent:User}>{
      const user = await this.prisma.user.findUnique({
        where: { id:userId }
      })

      if(!user || user.role !==  'STUDENT' ){
          throw new NotFoundException(`User with id ${userId} is not a student`)
      }

      if(user.status === 'APPROVED'){
        return { message:"Student already approved", updatedStudent:user }
      }

      try {
       const updatedStudent = await this.prisma.user.update({
       where: { id:userId },
       data:{
           status:"APPROVED"
       }
     })
     return { message:"Student updated successfully", updatedStudent }
      } catch (error) {
         throw new InternalServerErrorException("Could not update student")
      }
      
}

 //Reject a student
 async rejectStudent(userId:number):Promise<{message:string,updatedStudent:User}>{
      const user = await this.prisma.user.findUnique({
        where: { id:userId }
      })

      if(!user || user.role !==  'STUDENT' ){
          throw new NotFoundException(`User with id ${userId} is not a student`)
      }

      if(user.status === 'REJECTED'){
        return { message:"Student already rejected", updatedStudent:user }
      }

      try {
       const updatedStudent = await this.prisma.user.update({
       where: { id:userId },
       data:{
           status:"REJECTED",
           rejectedAt: new Date()
       }
     })
     return { message:"Student updated successfully", updatedStudent }
      } catch (error) {
         throw new InternalServerErrorException("Could not update student")
      }
      
}

//delete rejected students after 2 weeks
@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
async deleteOldRejectedStudents(){
      const twoWeeksAgo = new Date()
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

      await this.prisma.user.deleteMany({
        where: { 
          status: 'REJECTED',
          rejectedAt: { lt:twoWeeksAgo }
         }
      })
}

//reject notes
  async rejectNotes(notes_id: number) {
    return await this.prisma.note.update({
      where: {
        id: notes_id
      },
      data: {
        status: "REJECTED"
      }
    })
  }


  // View all approved notes
  async getApprovedNotes() {
    return await this.prisma.note.findMany({
      where: {
        status: "APPROVED"
      }
    })
  }


  //View all pending notes
  async getPendingNotes() {
  return await this.prisma.note.findMany({
       where: {
        status: "PENDING"
       }
  })
  }

// View activity logs
async getActivityLogs(limit = 10){
  const logs  = await this.prisma.note.findMany({
    orderBy: { createdAt:'desc' },
    take: limit,
    select:{
      id:true,
      title:true,
      status:true,
      createdAt:true,
      student:{
         select: {
          id:true,
          username: true,
          institutional_email:true
         }
      }
    }
  })

  return logs.map(note => ({
    id:note.id,
    title:note.title,
    status: note.status,
    uploadedAt:note.createdAt,
    owner: note.student
  }))
}


}




