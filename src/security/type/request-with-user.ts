import { AccessTokenPayload } from "src/user/type/payload";
import { Request } from "express";
export type RequestWithUser = Request & {
    user: AccessTokenPayload;
};
