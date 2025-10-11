import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaClient) {}
  
  async approveNotes (notes_id: number) {
    return await this.prisma.notes.Update({
      where: {
        id: notes_id
      },
      data: {
        status: "APPROVED"
      }
    })
  }
}
