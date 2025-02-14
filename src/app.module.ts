import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommsModule } from './comms/comms.module';
import { UserModule } from './user/user.module';
import { PricingModule } from './pricing/pricing.module';

@Module({
  imports: [CommsModule, UserModule, PricingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
