import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/login.dto';
import { UtilService } from 'src/common/services/util.service';
import { AuthGuard } from './auth.guard';
import { AppException } from 'src/common/exceptions/app.exeption';

@Controller('api/auth')
@ApiTags('Autenticación')
export class AuthController {
    constructor(
        private authSvc: AuthService,
        private utilSvc: UtilService
    ) { }

    @Post("login")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Verifica las credenciales y genera un JWT y un refresh token" })
    public async login(@Body() auth: AuthDto): Promise<any> {
        const { username, password } = auth;
        const user = await this.authSvc.getUserByUsername(username);

        if (!user) {
            throw new UnauthorizedException('El usuario y/o contraseña no existen');
        }

        if (await this.utilSvc.checkPassword(password, user.password ?? '')) {
            const { password, ...payload } = user;
            return await this.utilSvc.generateTokens(payload, this.authSvc.updateHash.bind(this.authSvc));
        } else {
            throw new UnauthorizedException('El usuario y/o contraseña no existen');
        }
    }

    @Get("profile")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: "Extrae el ID del usuario desde el token y busca la informacion" })
    public getProfile(@Req() request: any) {
        return request['user'];
    }

    @Post("refresh-token")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    public async refreshToken(@Req() request: any) {
        const userSession = request['user'];
        const user = await this.authSvc.getUserById(userSession.id);
        if (!user || !user.hash) throw new AppException("Acceso denegado", HttpStatus.FORBIDDEN);

        if (userSession.hash != user.hash) throw new AppException("Acceso denegado", HttpStatus.FORBIDDEN);
    
        const { password, hash, ...payload } = user;
        return await this.utilSvc.generateTokens(payload, this.authSvc.updateHash.bind(this.authSvc));
     }

     @Post("logout")
     @HttpCode(HttpStatus.NO_CONTENT)
     @UseGuards(AuthGuard)
    public async logout(@Req() request: any) {
        const session = request['user'];
        await this.authSvc.updateHash(session.id, null);
        return true;
     }
}