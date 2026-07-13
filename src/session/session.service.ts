import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RefreshSession } from "src/auth/entities/refresh-session.entity";
import { User } from "src/user/user.entity";
import { Repository } from "typeorm";
import { SessionRepository } from "./session.repository";


@Injectable()
export class SesssionService{
    constructor(private readonly sessionRepository: SessionRepository){}





}