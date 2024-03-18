import { TestBed } from '@automock/jest';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(UsersController).compile();

    controller = unit;
    service = unitRef.get(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
