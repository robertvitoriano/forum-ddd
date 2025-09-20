import {
  ConflictException,
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
})
type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>
@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { email, name, password } = body

    const userWithSameEmail = await this.prisma.user.findFirst({
      where: {
        email,
      },
    })
    const hashedPassword = await hash(password, 8)
    if (userWithSameEmail) {
      throw new ConflictException('user with same email address already exist')
    }
    await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    })
  }
}
