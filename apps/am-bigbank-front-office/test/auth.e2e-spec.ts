import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import bcrypt from 'bcryptjs';
import { PrismaError } from 'prisma-error-enum';
import { AppModule } from 'src/app.module';
import { authMocks } from 'src/auth/auth.mock';
import { PrismaService } from 'src/prisma.service';
import { userMocks } from 'src/users/users.mock';
import { UsersService } from 'src/users/users.service';
import request from 'supertest';

describe('Bookings controller (e2e)', () => {
  let app: INestApplication;
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
    jest.spyOn(usersService, 'create').mockResolvedValue(userMocks.dbUser);
  });

  it('/auth/login (POST) success', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(authMocks.signIn)
      .expect(200);
  });

  it('/auth/login (POST) failure (user not found)', async () => {
    jest.spyOn(usersService, 'findByEmail').mockRejectedValueOnce(new Error());
    jest.spyOn(bcrypt, 'compareSync').mockReturnValueOnce(false);

    return request(app.getHttpServer())
      .post('/auth/login')
      .send(authMocks.signIn)
      .expect(401);
  });

  it('/auth/login (POST) failure (wrong password)', async () => {
    jest.spyOn(bcrypt, 'compareSync').mockReturnValueOnce(false);

    return request(app.getHttpServer())
      .post('/auth/login')
      .send(authMocks.signIn)
      .expect(401);
  });

  it('/auth/register (POST) success', async () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(authMocks.signUp)
      .expect(201);
  });

  it('/auth/register (POST) already taken', async () => {
    jest.spyOn(usersService, 'create').mockRejectedValueOnce(
      new PrismaClientKnownRequestError('', {
        clientVersion: '',
        code: PrismaError.UniqueConstraintViolation,
        meta: { target: ['email'] },
      }),
    );

    return request(app.getHttpServer())
      .post('/auth/register')
      .send(authMocks.signUp)
      .expect(409);
  });

  it('/auth/register (POST) bad email', async () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ ...authMocks.signUp, email: 'bademail' })
      .expect(400);
  });

  it('/auth/register (POST) bad username', async () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ ...authMocks.signUp, email: '_' })
      .expect(400);
  });

  it('/auth/register (POST) bad password', async () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ ...authMocks.signUp, password: 'badpassword' })
      .expect(400);
  });
});
