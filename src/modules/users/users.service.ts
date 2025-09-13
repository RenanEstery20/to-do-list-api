import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@shared/prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService ){}

    async create(data:CreateUserDto){
        const userAlreadyExists = await this.prismaService.user.findUnique({
            where:{
                email: data.email
            }
        })

        if(userAlreadyExists){
            throw new UnauthorizedException('User already exists')
        }

        const hashedPassword = await bcrypt.hash(data.password, 10)

        const user = await this.prismaService.user.create({data:{...data, password: hashedPassword}})

        return{
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt
        }
    }
}
