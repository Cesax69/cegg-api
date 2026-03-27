import { Injectable, forwardRef, Inject } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { AuthService } from "src/modules/auth/auth.service";

@Injectable()
export class UtilService {

    constructor(
        private jwtService: JwtService,
        @Inject(forwardRef(() => AuthService))
        private authSvc: AuthService,
    ) { }

    public async hash(text: string): Promise<string> {
        return await bcrypt.hash(text, 10);
    }

    public async checkPassword(text: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(text, hash);
    }

    public getPayload(user: any): any {
        return {
            id: user.id,
            name: user.name,
            lastname: user.lastname,
            createdAt: user.createdAt,
        };
    }

    public async generateJWT(payload: any, expiresIn: string): Promise<string> {
        return await this.jwtService.signAsync(payload, { expiresIn: expiresIn as any });
    }

    public async generateTokens(payload: any): Promise<{ jwt: string; refreshToken: string }> {
        // Generar refresh token (7 días)
        const refreshToken = await this.generateJWT(payload, '7d');

        // Hashear el refresh token y guardarlo en la BD
        const hashedToken = await this.hash(refreshToken);
        await this.authSvc.updateHash(payload.id, hashedToken);

        // Generar token de acceso (1 hora)
        const jwt = await this.generateJWT(payload, '1h');

        return { jwt, refreshToken };
    }
}