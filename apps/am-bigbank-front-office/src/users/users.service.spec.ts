import { TestBed } from '@automock/jest';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(UsersService).compile();

    service = unit;
    prismaService = unitRef.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prismaService).toBeDefined();
  });
});
