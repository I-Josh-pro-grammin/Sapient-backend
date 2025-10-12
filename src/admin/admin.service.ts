import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Note, User } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async approveNotes (notes_id: number) {
    return await this.prisma.note.update({
      where: {
        id: notes_id
      },
      data: {
        status: "APPROVED"
      }
    })
  }

  async viewApprovedNotes():Promise<{notes:Note[]}>{
      const notes = await this.prisma.note.findMany({
        where:{ status: "APPROVED" }
      })

      return { notes }
  }

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




