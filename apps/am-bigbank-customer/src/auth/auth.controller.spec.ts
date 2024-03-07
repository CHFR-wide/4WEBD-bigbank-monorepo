import { TestBed } from '@automock/jest';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(AuthController).compile();

    controller = unit;
    service = unitRef.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
