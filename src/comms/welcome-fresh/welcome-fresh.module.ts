import { Module } from '@nestjs/common';
import { WelcomeFreshController } from './welcome-fresh.controller';
import { WelcomeFreshService } from './welcome-fresh.service';
import { UserModule } from '../../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [WelcomeFreshController],
  providers: [WelcomeFreshService],
})
export class WelcomeFreshModule {}
