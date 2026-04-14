import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma.service';

@Catch()
@Injectable()
export class AllExceptionFilter implements ExceptionFilter {

    constructor(private readonly prisma: PrismaService) { }

    async catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        let message = exception instanceof HttpException
            ? exception.getResponse()
            : 'Internal Server Error';
        
        // Manejo específico de colisiones de Constraints Únicos de Prisma (Ej. Email / Username ya registrado)
        if (exception?.code === 'P2002') {
            status = HttpStatus.CONFLICT;
            message = 'El correo o nombre de usuario ya está registrado en el sistema.';
        }

        const errorText = typeof message === 'string'
            ? message
            : (message as any).message || JSON.stringify(message);

        const errorCode = exception?.code || 'UNKNOWN_ERROR';
        const session = (request as any)['user'];

        try {
            await this.prisma.log.create({
                data: {
                    statusCode: status,
                    timestamp: new Date(),
                    path: request.url,
                    error: String(errorText),
                    errorCode: String(errorCode),
                    session_id: session?.id ?? null,
                },
            });
        } catch (dbError) {
            console.error('CRITICAL: Failed to write to Log table:', dbError);
        }
        
        const isInternalError = status >= 500;
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            error: isInternalError ? 'Error interno del servidor' : errorText,
        });
    }
}