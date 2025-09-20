import {
  HttpException,
  ConflictException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}
  @Post()
  @HttpCode(201)
  async handle(@Body() body: any) {
    const { email, name, password } = body

    const userWithSameEmail = await this.prisma.user.findFirst({
      where: {
        email,
      },
    })
    if (userWithSameEmail) {
      throw new ConflictException('user with same email address already exist')
    }
    await this.prisma.user.create({
      data: {
        email,
        name,
        password,
      },
    })
  }
}
