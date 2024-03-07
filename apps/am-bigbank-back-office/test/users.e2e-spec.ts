import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import bcrypt from 'bcryptjs';
import { AppModule } from 'src/app.module';
import { authMocks } from 'src/auth/auth.mock';
import { PrismaService } from 'src/prisma.service';
import { userMocks } from 'src/users/users.mock';
import { UsersService } from 'src/users/users.service';
import request from 'supertest';

describe('Users controller (e2e)', () => {
  let app: INestApplication;
  let access_token: string;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({})
      .compile();

    usersService = moduleFixture.get(UsersService);
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.init();
  });

  beforeEach(async () => {
    jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);

    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(userMocks.dbUser);
    jest.spyOn(usersService, 'findOne').mockResolvedValue(userMocks.dbUser);
    jest.spyOn(usersService, 'create').mockResolvedValue(userMocks.dbUser);
    jest.spyOn(usersService, 'update').mockResolvedValue(userMocks.dbUser);
    jest.spyOn(usersService, 'remove').mockResolvedValue(userMocks.dbUser);
  });

  describe('Regular user flow', () => {
    it('/auth/login (POST)', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send(authMocks.signIn)
        .expect(200);
      access_token = loginResponse.body.access_token;
    });

    it('/users/me (GET)', async () => {
      return request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', 'Bearer ' + access_token)
        .expect(200)
        .expect(userMocks.dbSafeUser);
    });

    it('/users/0 (GET)', async () => {
      return request(app.getHttpServer())
        .get('/users/0')
        .set('Authorization', 'Bearer ' + access_token)
        .expect(403);
    });

    it('/users/0 (PATCH)', async () => {
      return request(app.getHttpServer())
        .patch('/users/0')
        .send(authMocks.signUp)
        .set('Authorization', 'Bearer ' + access_token)
        .expect(200)
        .expect(userMocks.dbSafeUser);
    });

    it('/users/1 (PATCH) other user', async () => {
      return request(app.getHttpServer())
        .patch('/users/1')
        .send(authMocks.signUp)
        .set('Authorization', 'Bearer ' + access_token)
        .expect(403);
    });

    it('/users/0 (PATCH) bad email', async () => {
      return request(app.getHttpServer())
        .patch('/users/0')
        .send({ ...authMocks.signUp, email: 'bademail' })
        .set('Authorization', 'Bearer ' + access_token)
        .expect(400);
    });

    it('/users/0 (PATCH) bad username', async () => {
      return request(app.getHttpServer())
        .patch('/users/0')
        .send({ ...authMocks.signUp, username: '_' })
        .set('Authorization', 'Bearer ' + access_token)
        .expect(400);
    });

    it('/users/0 (PATCH) bad password', async () => {
      return request(app.getHttpServer())
        .patch('/users/0')
        .send({ ...authMocks.signUp, password: 'notsecure' })
        .set('Authorization', 'Bearer ' + access_token)
        .expect(400);
    });

    it('/users/0 (DELETE)', async () => {
      return request(app.getHttpServer())
        .delete('/users/0')
        .set('Authorization', 'Bearer ' + access_token)
        .expect(200)
        .expect(userMocks.dbSafeUser);
    });

    it('/users/1 (DELETE)', async () => {
      return request(app.getHttpServer())
        .delete('/users/1')
        .set('Authorization', 'Bearer ' + access_token)
        .expect(403);
    });
  });

  describe('Employee user flow', () => {
    beforeEach(() => {
      jest
        .spyOn(usersService, 'findByEmail')
        .mockResolvedValue(userMocks.dbEmplyee);
    });

    it('/auth/login (POST)', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send(authMocks.signIn)
        .expect(200);
      access_token = loginResponse.body.access_token;
    });

    it('/users/0 (GET)', async () => {
      return request(app.getHttpServer())
        .get('/users/0')
        .set('Authorization', 'Bearer ' + access_token)
        .expect(200)
        .expect(userMocks.dbSafeUser);
    });

    it('/users/0 (PATCH) other user', async () => {
      return request(app.getHttpServer())
        .patch('/users/0')
        .send(authMocks.signUp)
        .set('Authorization', 'Bearer ' + access_token)
        .expect(403);
    });
  });

  describe('Admin user flow', () => {
    beforeEach(() => {
      jest
        .spyOn(usersService, 'findByEmail')
        .mockResolvedValue(userMocks.dbAdmin);
    });

    it('/auth/login (POST)', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send(authMocks.signIn)
        .expect(200);
      access_token = loginResponse.body.access_token;
    });

    it('/users/0 (GET)', async () => {
      return request(app.getHttpServer())
        .get('/users/0')
        .set('Authorization', 'Bearer ' + access_token)
        .expect(200)
        .expect(userMocks.dbSafeUser);
    });

    it('/users/0 (PATCH) other user', async () => {
      return request(app.getHttpServer())
        .patch('/users/0')
        .send(authMocks.signUp)
        .set('Authorization', 'Bearer ' + access_token)
        .expect(200)
        .expect(userMocks.dbSafeUser);
    });
  });
});
