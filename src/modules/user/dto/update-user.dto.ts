import {
    IsEmail,
    IsOptional,
    IsString,
    MaxLength,
} from "class-validator";

export class UpdateUserDto {

    @IsOptional()
    @IsEmail({}, { message: "El email debe ser un correo válido" })
    email?: string;

    @IsOptional()
    @IsString({ message: "El nombre debe ser un texto" })
    @MaxLength(100, { message: "El nombre no debe exceder los 100 caracteres" })
    name?: string;
}
