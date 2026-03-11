import { ApiProperty } from "@nestjs/swagger";
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
} from "class-validator";

export class CreateUserDto {

    @IsEmail({}, { message: "El email debe ser un correo válido" })
    @IsNotEmpty({ message: "El email es requerido" })
    @ApiProperty({ description: "Email del usuario" })
    email: string;

    @IsOptional()
    @IsString({ message: "El nombre debe ser un texto" })
    @MaxLength(100, { message: "El nombre no debe exceder los 100 caracteres" })
    @ApiProperty({ description: "Nombre del usuario", required: false })
    name?: string;

    @IsString({ message: "La contraseña debe ser un texto" })
    @IsNotEmpty({ message: "La contraseña es requerida" })
    @ApiProperty({ description: "Contraseña del usuario" })
    password: string;
}
