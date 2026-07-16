import { Module } from "@nestjs/common";
import { S3Service } from "./s3.service";
import { S3Lib } from "./s3Symbols";
import * as AWS from "@aws-sdk/client-s3";

@Module({
    providers: [
        S3Service,
        {
            provide: S3Lib,
            useFactory: () => {
                // TODO: укажи только accessKeyId, secretAccessKey
                return new AWS.S3({
                    endpoint: "http://127.0.0.1:9000",
                    region: "ru-central1",
                    credentials: {
                        accessKeyId: "minioadmin",
                        secretAccessKey: "minioadmin",
                    },
                });
            },
        },
    ],
})
export class S3Module {}
