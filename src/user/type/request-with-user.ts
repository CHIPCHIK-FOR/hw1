import { Request } from 'express';
import { AccessTokenPayload } from './payload';

export type RequestWithUser = Request & {
    user: AccessTokenPayload;
};