import { Test, TestingModule } from '@nestjs/testing';
import { MobileNotificationsService } from './mobile-notifications.service';

describe('MobileNotificationsService', () => {
  let service: MobileNotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MobileNotificationsService],
    }).compile();

    service = module.get<MobileNotificationsService>(MobileNotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
