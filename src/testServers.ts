import express from 'express';
import { MongoDBClient } from './mongoDBClient';

export module TestServers {
    export function startLocalServer(port: number, mongoDBClient: MongoDBClient) {
        const app = express();

        app.get('/', (req, res) => {
            const document = mongoDBClient.getDocument('test', 'test', 'test');
            res.send('Hello World!');
        });

        app.listen(port, () => {});
    }
}

