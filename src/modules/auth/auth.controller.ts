import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('api/auth')
@ApiTags('Autenticación')
export class AuthController {
    constructor(private authSvc: AuthService) { }

    @Post("login")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Verifica las credenciales y genera un JWT y un refresh token" })
    public async login(@Body() loginDto: LoginDto) {
        return await this.authSvc.login(loginDto);
    }

    @Get("profile")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Extrae el ID del usuario desde el token y busca la informacion" })
    public getProfile() { }

    public refreshToken() { }

    public logout() { }
}