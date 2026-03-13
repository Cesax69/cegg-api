import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto {

    @IsString({ message: "El username debe ser un texto" })
    @IsNotEmpty({ message: "El username es requerido" })
    @ApiProperty({ description: "Username del usuario" })
    username: string;

    @IsString({ message: "La contraseña debe ser un texto" })
    @IsNotEmpty({ message: "La contraseña es requerida" })
    @ApiProperty({ description: "Contraseña del usuario" })
    password: string;
}
