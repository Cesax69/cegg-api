import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UtilService } from 'src/common/services/util.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private utilSvc: UtilService,
    ) { }

    async login(loginDto: LoginDto): Promise<any> {
        // 1. Verificar el username en la base de datos
        const user = await this.prisma.user.findUnique({
            where: { username: loginDto.username },
        });

        // 2. Si el usuario no existe, devolver UnauthorizedException 401
        if (!user) {
            throw new UnauthorizedException('Usuario no encontrado');
        }

        // 3. Revisar la contraseña con checkPassword de UtilService
        const isPasswordValid = await this.utilSvc.checkPassword(loginDto.password, user.password ?? '');

        if (!isPasswordValid) {
            throw new UnauthorizedException('Contraseña incorrecta');
        }

        // 4. Generar el payload {id, name, lastname, created_at}
        const payload = this.utilSvc.getPayload(user);

        // 5. Generar access token (60 segundos) y refresh token (7 días)
        const accessToken = this.utilSvc.generateToken(payload, 60);
        const refreshToken = this.utilSvc.generateToken(payload, 7 * 24 * 60 * 60);

        // 6. Guardar el refresh token en la base de datos
        await this.prisma.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });

        // 7. Retornar access token y refresh token
        return {
            accessToken,
            refreshToken,
        };
    }
}
