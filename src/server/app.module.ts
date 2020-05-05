import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';

@Module({
  imports: [TasksModule, AuthModule, TypeOrmModule.forRoot(typeOrmConfig)],
  controllers: [AppController],
})
export class AppModule {}
