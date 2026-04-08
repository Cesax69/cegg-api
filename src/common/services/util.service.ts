import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

@Injectable()
export class UtilService {

    constructor(private jwtService: JwtService) { }

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
            rol_id: user.rol_id,
            createdAt: user.createdAt,
        };
    }

    public async generateJWT(payload: any, expiresIn: string): Promise<string> {
        return await this.jwtService.signAsync(payload, { expiresIn: expiresIn as any });
    }

    public async generateTokens(payload: any, updateHashFn: (id: number, hash: string) => Promise<any>): Promise<{ acces_token: string; refresh_token: string }> {
        // Generar refresh token (7 días)
        const refreshToken = await this.generateJWT(payload, '7d');

        // Hashear el refresh token y guardarlo en la BD
        const hashedToken = await this.hash(refreshToken);
        await updateHashFn(payload.id, hashedToken);

        // Generar token de acceso (1 hora)
        const jwt = await this.generateJWT(payload, '1h');

        return { acces_token: jwt, refresh_token: refreshToken };
    }
}