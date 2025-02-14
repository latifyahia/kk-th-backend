import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommsModule } from './comms/comms.module';
import { UserModule } from './user/user.module';
import { PricingModule } from './pricing/pricing.module';

describe('AppController', () => {
  let appController: AppController;
  let commsModule: CommsModule;
  let userModule: UserModule;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
      imports: [CommsModule, UserModule, PricingModule],
    }).compile();

    appController = app.get<AppController>(AppController);
    commsModule = app.get<CommsModule>(CommsModule);
  });

  it('AppController should be defined', () => {
    expect(appController).toBeDefined();
  });

  it('CommsModule should be defined', () => {
    expect(commsModule).toBeDefined();
  });
});
