import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

@Injectable()
export class UtilService {

    constructor(private jwtService: JwtService) { }

    public async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    public async checkPassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

    public getPayload(user: any): any {
        return {
            id: user.id,
            name: user.name,
            lastname: user.lastname,
            created_at: user.createdAt,
        };
    }

    public generateToken(payload: any, expiresIn: number): string {
        return this.jwtService.sign(payload, { expiresIn });
    }
}