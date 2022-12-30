import { NextFunction, Response, Request } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { BaseController } from "../../common/base.controller";
import { HTTPError } from "../../errors/http-error.class";
import { LoggerService } from "../../logger/logger.service";
import "reflect-metadata";
import { IUserController } from "./users.controller.interface";
import { UserLoginDto } from "../dto/user.login.dto";
import { UserRegisterDto } from "../dto/user.register.dto";
import { IUserService } from "../service/users.service.interface";
import { ILogger } from "../../logger/logger.interface";
import { ValidateMiddleware } from "../../common/validate.middleware";

@injectable()
export class UserController extends BaseController implements IUserController {
  constructor(
    @inject(TYPES.ILogger) private loggerService: ILogger,
    @inject(TYPES.UserService) private userService: IUserService
  ) {
    super(loggerService);
    this.BindRoutes([
      {
        path: "/register",
        method: "post",
        func: this.register,
        middlewares: [new ValidateMiddleware(UserRegisterDto)],
      },
      { path: "/login", method: "post", func: this.login, middlewares: []},
    ]);
  }

async login({body}: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction) {
  const result = await this.userService.validateUser(body); 
  if(!result){
    return next(new HTTPError(401, "Authorization error"));
  }
    this.ok(res, "Login successful")
  }

async register(
    { body }: Request<{}, {}, UserRegisterDto>,
    res: Response,
    next: NextFunction
  ) {
      const result = await this.userService.createUser(body);   
        
    if (!result) {
      return next(new HTTPError(422, "This user already exist"));
    }
    this.ok(res, { email: result.email, id: result.id });
  }
}
