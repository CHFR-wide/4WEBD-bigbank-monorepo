import { Test, TestingModule } from '@nestjs/testing';
import { MobileNotificationsController } from './mobile-notifications.controller';
import { MobileNotificationsService } from './mobile-notifications.service';

describe('MobileNotificationsController', () => {
  let controller: MobileNotificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MobileNotificationsController],
      providers: [MobileNotificationsService],
    }).compile();

    controller = module.get<MobileNotificationsController>(MobileNotificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
