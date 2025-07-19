import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BibleModule } from './bible/bible.module';

@Module({
  imports: [BibleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
