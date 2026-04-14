import { ApiProperty } from "@nestjs/swagger";
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
    Matches,
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

    @IsOptional()
    @IsString({ message: "El apellido debe ser un texto" })
    @MaxLength(100, { message: "El apellido no debe exceder los 100 caracteres" })
    @ApiProperty({ description: "Apellido del usuario", required: false })
    lastname?: string;

    @IsString({ message: "El username debe ser un texto" })
    @IsNotEmpty({ message: "El username es requerido" })
    @MinLength(3, { message: "El username debe tener al menos 3 caracteres" })
    @MaxLength(50, { message: "El username no debe exceder los 50 caracteres" })
    @ApiProperty({ description: "Username del usuario" })
    username: string;

    @IsString({ message: "La contraseña debe ser un texto" })
    @IsNotEmpty({ message: "La contraseña es requerida" })
    @MinLength(8, { message: "La contraseña debe tener al menos 8 caracteres" })
    @MaxLength(128, { message: "La contraseña no debe exceder los 128 caracteres" })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: "La contraseña es muy débil. Debe tener minúsculas, mayúsculas y números o símbolos." })
    @ApiProperty({ description: "Contraseña del usuario" })
    password: string;
}
