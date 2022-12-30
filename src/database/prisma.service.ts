import { PrismaClient, UserModel} from "@prisma/client";
import { inject, injectable } from "inversify";
import 'reflect-metadata';
import { ILogger } from "../logger/logger.interface";
import { TYPES } from "../types";

@injectable()
export class PrismaService{
    client: PrismaClient;

    constructor(@inject(TYPES.ILogger) private logger: ILogger){
        this.client = new PrismaClient();
    }

    async connect(){
        await this.client.$connect()
        this.logger.log("DB connected");
    }


    async disconnect(){
        await this.client.$disconnect();
        this.logger.log("DB disconnected");
    }
}