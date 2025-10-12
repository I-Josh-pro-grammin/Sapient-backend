import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async approveNotes(notes_id: number) {
    return await this.prisma.notes.update({
      where: {
        id: notes_id
      },
      data: {
        status: "APPROVED"
      }
    })
  }

  async rejectNotes(notes_id: number) {
    return await this.prisma.notes.update({
      where: {
        id: notes_id
      },
      data: {
        status: "REJECTED"
      }
    })
  }

  async getApprovedNotes() {
    return await this.prisma.notes.findMany({
      where: {
        status: "APPROVED"
      }
    })
  }

  async getPendingNotes() {
  return await this.prisma.notes.findMany({
       where: {
        status: "PENDING"
       }
  })
  }

}
