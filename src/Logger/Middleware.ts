import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private readonly logger = new Logger(LoggerMiddleware.name);

    use(req: Request, res: Response, next: NextFunction) {
        const startedAt = Date.now();

        res.on("finish", () => {
            const duration = Date.now() - startedAt;

            this.logger.log(
                `${req.method} ${req.originalUrl} → ${res.statusCode} — ${duration} ms`,
            );
        });
        next();
    }
}
