import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { CreateAccountController } from './controllers/create-account.controller'
import { AppController } from './app.controller'

@Module({
  imports: [],
  controllers: [CreateAccountController, AppController],
  providers: [PrismaService],
})
export class AppModule {}
