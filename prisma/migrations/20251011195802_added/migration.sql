-- AddForeignKey
ALTER TABLE "note" ADD CONSTRAINT "note_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
