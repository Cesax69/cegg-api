import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        // Obtener el request de la petición
        const request = context.switchToHttp().getRequest<Request>();

        // Verificar que exista el token
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('Token no proporcionado');
        }

        try {
            // Si el token es funcional, agregar el user (payload)
            const payload = await this.jwtService.verifyAsync(token);
            request['user'] = payload;
        } catch {
            throw new UnauthorizedException('Token inválido o expirado');
        }

        // Devolver el resultado
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(" ") ?? [];
        return type == "Bearer" ? token : undefined;
    }
}
