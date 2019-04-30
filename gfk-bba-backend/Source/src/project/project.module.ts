import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { Project } from './project.entity';
import { AuthModule } from '../shared/auth/auth.module';
import { UserDataService } from '../shared/auth/user-data.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project]), AuthModule, UserDataService],
  providers: [ProjectService],
  controllers: [ProjectController],
  exports: [ProjectService],
})
export class ProjectModule {}
