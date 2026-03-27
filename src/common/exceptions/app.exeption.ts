import { HttpException, HttpStatus } from "@nestjs/common";

export class AppException extends HttpException{
    constructor(
        public readonly message: string,
        public readonly statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
        public readonly errorCode: string = 'UNKNOWN_ERROR'
    ){
        super(message, statusCode);
    }
}