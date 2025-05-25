/* eslint-disable prettier/prettier */

import { Test } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as pactum from "pactum";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";
import { AuthDto } from "src/auth/dto";
import { EditUserDto } from "src/user/dto";

describe("App e2e", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    prisma = app.get(PrismaService);
    pactum.request.setBaseUrl("http://localhost:3000");
    await prisma.cleanDB();
    await app.init();
    await app.listen(3000);
  }, 30000); // Increased timeout to 30 seconds

  afterAll(async () => {
    await app.close();
  });

  describe("Auth", () => {
    const dto: AuthDto = {
      email: "",
      password: "izere12",
    };

    describe("Signup", () => {
      it("Should signup", async () => {
        await pactum
          .spec()
          .post("/auth/signup")
          .withBody({
            email: "izere@gmail.com",
            password: dto.password,
          })
          .expectStatus(201);
      });
    });

    describe("Login", () => {
      it("Should throw an error if email is empty", async () => {
        await pactum.spec().post("/auth/login").withBody(dto).expectStatus(400);
      });

      it("Should throw an error if password is invalid", async () => {
        await pactum
          .spec()
          .post("/auth/login")
          .withBody({ email: "izere@gmail.com" })
          .expectStatus(400);
      });

      it("Should login", async () => {
        await pactum
          .spec()
          .post("/auth/login")
          .withBody({
            email: "izere@gmail.com",
            password: dto.password,
          })
          .expectStatus(201);
      });
    });
  });

  describe("Users", () => {
    describe("Get me", () => {});

    describe("Edit me", () => {
      const dto: EditUserDto = {
        firstname: "Funny",
        email: "funny@gmail.com",
      };

      it("Should edit user", async () => {
        await pactum
        .spec()
        .patch("/users")
        .withHeaders({
          Authorization: 'Bearer $S{userAt}'
        })
        .withBody(dto)
        .expectStatus(200)
        .expectBody(dto.firstname)
        .expectBody(dto.email);
      });
    });
  });

  describe("Bookmarks", () => {
    describe("Create bookmark", () => {});

    describe("Get bookmark by Id", () => {});

    describe("Get bookmarks", () => {});

    describe("Edit bookmark by id", () => {});

    describe("Delete bookmark by id", () => {});
  });

  it.todo("should pass");
});
