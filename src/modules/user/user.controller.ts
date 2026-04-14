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
        
        try {
            const result = await this.userSvc.insertUser(user);
            return result;
        } catch (error: any) {
            if (error.code === 'P2002') {
                const fields = error.meta?.target || "registro";
                throw new HttpException(`El campo '${fields}' ya se encuentra en uso por otro usuario`, HttpStatus.BAD_REQUEST);
            }
            throw new HttpException("Error procesando registro", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put(":id")
    @UseGuards(AuthGuard)
    public async updateUser(@Param("id", ParseIntPipe) id: number, @Body() user: UpdateUserDto, @Req() req: any): Promise<User> {
        const currentUser = req.user;
        const currentUserId = Number(currentUser.sub || currentUser.id);
        
        if (currentUserId !== Number(id) && Number(currentUser.rol_id) !== 1) {
            throw new HttpException("No tienes permiso para editar a otro usuario", HttpStatus.FORBIDDEN);
        }

        try {
            const updated = await this.userSvc.updateUser(id, user);
            return updated;
        } catch (error: any) {
            if (error.code === 'P2002') {
                const fields = error.meta?.target || "registro";
                throw new HttpException(`El campo '${fields}' ya se encuentra en uso en el sistema`, HttpStatus.BAD_REQUEST);
            }
            throw new HttpException("Error actualizando expediente", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Patch(":id/rol")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(1) 
    public updateRole(@Param("id", ParseIntPipe) id: number, @Body('rol_id', ParseIntPipe) rol_id: number): Promise<User> {
        return this.userSvc.updateUser(id, { rol_id } as any);
    }

    @Delete(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(1) 
    public async deleteUser(@Param("id", ParseIntPipe) id: number, @Req() req: any): Promise<boolean> {
        const currentUserId = Number(req.user.sub || req.user.id);
        
        if (id === currentUserId) {
            throw new HttpException("No puedes eliminar tu propia cuenta en sesión", HttpStatus.FORBIDDEN);
        }

        const userToDelete = await this.userSvc.getUserById(id);
        if (!userToDelete) {
             throw new HttpException("Usuario no encontrado", HttpStatus.NOT_FOUND);
        }
        if (userToDelete.rol_id === 1) {
            throw new HttpException("Acceso Denegado: Imposible eliminar a otro Administrador", HttpStatus.FORBIDDEN);
        }

        try {
            await this.userSvc.deleteUser(id);
            return true;
        } catch (error: any) {
            throw new HttpException("Error interno eliminando usuario", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
