import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

@Injectable()
export class UtilService {
    
    public async hashPassword(password: string): Promise<string>{
        return await bcrypt.hash(password, 10);
    }

    public async checkPassword(password: string, hash: string): Promise<boolean>{
        return await bcrypt.compareSync(password, hash);
    }
}