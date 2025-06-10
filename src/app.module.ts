import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
// import {
//   ThrottlerGuard,
//   ThrottlerModule,
// } from "@nestjs/throttler";
// import { APP_GUARD } from "@nestjs/core";
import { CoursesModule } from './courses/courses.module';

@Module({
  imports: [
    // ThrottlerModule.forRoot({
    //   ttl: 60,
    //   limit: 5,
    // }),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    PrismaModule,
    CoursesModule,
  ],
  // providers: [
  //   {
  //     provide: APP_GUARD,
  //     useClass: ThrottlerGuard,
  //   },
  // ],
})
export class AppModule {}
