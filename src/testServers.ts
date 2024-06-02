import express from 'express';
import { MongoDBClient } from './mongoDBClient';

export module TestServers {
    export function startLocalServer(port: number, mongoDBClient: MongoDBClient) {
        const app = express();

        app.get('/document/:id', (req, res) => {
            const { id } = req.params;
            const document = mongoDBClient.getDocument('test', 'test', id);
            res.send(document);
        });

        app.listen(port, () => { });
    }
}

