import express, { Express } from "express";
import { Server } from 'http';
import { inject, injectable } from "inversify";
import { TYPES } from "./types";
import { ILogger } from "./logger/logger.interface";
import { json } from "body-parser";
import 'reflect-metadata';
import { IConfigService } from "./config/config.service.interface";
import { IUserController } from "./users/controller/users.controller.interface";
import { IExceptionFilter } from "./errors/exception.filter.interface";
import { UserController } from "./users/controller/users.controller";
import { PrismaService } from "./database/prisma.service";

@injectable()
export class App{
    app: Express;
    server: Server;
    port: number;

    constructor(
        @inject(TYPES.ILogger) private logger: ILogger,
        @inject(TYPES.UserController) private userController: UserController, 
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.PrismaService) private prismaService: PrismaService,
        @inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter)
    {
        this.app = express();
        this.port = 8888;
    }

    useMiddleware() {
        this.app.use(json());
    }

    useRoutes() {
        this.app.use('/users', this.userController.router);
        
    }

    useExceptionsFilters(){
        this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter))
    }

    public async init(){
        this.useMiddleware();
        this.useRoutes();
        this.useExceptionsFilters();
        await this.prismaService.connect();
        this.server = this.app.listen(this.port);
        this.logger.log(`Server start on port: ${this.port}`);
    }


}