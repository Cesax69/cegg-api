import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('api/user')
@ApiTags('Usuarios')
export class UserController {
    constructor(private readonly userSvc: UserService) { }

    @Get()
    public async getUsers(): Promise<User[]> {
        return await this.userSvc.getUsers();
    }

    @Get(':id')
    public async getUserById(@Param("id", ParseIntPipe) id: number): Promise<User> {
        const result = await this.userSvc.getUserById(id);

        if (result == undefined) {
            throw new HttpException(`Usuario con ID ${id} no encontrado`, HttpStatus.NOT_FOUND);
        }
        return result;
    }

    @Post()
    public insertUser(@Body() user: CreateUserDto): Promise<User> {
        const result = this.userSvc.insertUser(user);

        if (result == undefined)
            throw new HttpException("Usuario no registrado", HttpStatus.INTERNAL_SERVER_ERROR);

        return result;
    }

    @Put(":id")
    public updateUser(@Param("id", ParseIntPipe) id: number, @Body() user: UpdateUserDto): Promise<User> {
        return this.userSvc.updateUser(id, user);
    }

    @Delete(':id')
    public async deleteUser(@Param("id", ParseIntPipe) id: number): Promise<boolean> {
        try {
            await this.userSvc.deleteUser(id);
        } catch (error) {
            throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        }
        return true;
    }
}
