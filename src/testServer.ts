import express, { Express } from 'express';
import { MongoDBClient } from './mongoDBClient';

export class TestServer {
    app: Express;
    database: string;

    constructor(port: number, mongoDBClient: MongoDBClient, database: string) {
        this.app = express();
        this.database = database;

        this.app.get('/:collection', async (req, res) => {
            const { collection } = req.params;
            const documents = await mongoDBClient.getDocuments(this.database, collection);
            res.send(documents);
        });

        this.app.get('/:collection/:id', async (req, res) => {
            const { collection, id } = req.params;
            const document = await mongoDBClient.getDocument(this.database, collection, id);
            res.send(document);
        });

        this.app.listen(port, () => { });
    }
}

