import { Controller, Get, HttpStatus, Post, HttpCode } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
@Controller('api/auth')
export class AuthController {
  constructor(private authSvc: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Veririfica las credenciales y genera un JWT y un refresh token" })
  public login(): string {
    return this.authSvc.login();
  }

  @Get("profile")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Extrae el ID del usuario desde el token y busca la informacion" })
  public getProfile(){}

  public refreshToken(){}

  public logout(){}
}
