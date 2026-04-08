import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { UtilService } from 'src/common/services/util.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('api/user')
@ApiTags('Usuarios')
export class UserController {
    constructor(private readonly userSvc: UserService, private readonly utilSvc: UtilService) { }

    @Get()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(1) // 1 = Admin
    public async getUsers(): Promise<User[]> {
        return await this.userSvc.getUsers();
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    public async getUserById(@Param("id", ParseIntPipe) id: number, @Req() req: any): Promise<User> {
        const currentUser = req.user;
        const currentUserId = Number(currentUser.sub || currentUser.id);
        
        // Un usuario normal solo puede consultar su propio perfil
        if (currentUserId !== Number(id) && Number(currentUser.rol_id) !== 1) {
            throw new HttpException("No tienes permiso para ver a otro usuario", HttpStatus.FORBIDDEN);
        }

        const result = await this.userSvc.getUserById(id);

        if (result == undefined) {
            throw new HttpException(`Usuario con ID ${id} no encontrado`, HttpStatus.NOT_FOUND);
        }
        return result;
    }

    @Post()
    public async insertUser(@Body() user: CreateUserDto): Promise<User> {
        const encryptedPassword = await this.utilSvc.hash(user.password);
        user.password = encryptedPassword;
        
        const result = await this.userSvc.insertUser(user);

        if (result == undefined)
            throw new HttpException("Usuario no registrado", HttpStatus.INTERNAL_SERVER_ERROR);

        return result;
    }

    @Put(":id")
    @UseGuards(AuthGuard)
    public updateUser(@Param("id", ParseIntPipe) id: number, @Body() user: UpdateUserDto, @Req() req: any): Promise<User> {
        const currentUser = req.user;
        const currentUserId = Number(currentUser.sub || currentUser.id);
        
        // El usuario solo puede editarse a sí mismo, a menos que sea un Admin (rol 1)
        if (currentUserId !== Number(id) && Number(currentUser.rol_id) !== 1) {
            throw new HttpException("No tienes permiso para editar a otro usuario", HttpStatus.FORBIDDEN);
        }

        return this.userSvc.updateUser(id, user);
    }

    @Patch(":id/rol")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(1) // Solo Admin
    public updateRole(@Param("id", ParseIntPipe) id: number, @Body('rol_id', ParseIntPipe) rol_id: number): Promise<User> {
        return this.userSvc.updateUser(id, { rol_id } as any);
    }

    @Delete(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(1) // Solo Admin
    public async deleteUser(@Param("id", ParseIntPipe) id: number): Promise<boolean> {
        try {
            await this.userSvc.deleteUser(id);
        } catch (error) {
            throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        }
        return true;
    }
}
