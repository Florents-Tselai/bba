import { AuthModule } from '../shared/auth/auth.module';
import { Link } from './link.entity';
import { LinkService } from './link.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Link]), AuthModule],
  providers: [LinkService],
  controllers: [],
  exports: [LinkService],
})
export class LinkModule {}
