import express, { Express } from 'express';
import { MongoDBClient } from './mongoDBClient';
import { Server } from 'http';
import _ from 'lodash';

export class TestServer {
    app: Express;
    database: string;
    server: Server;

    constructor(port: number, mongoDBClient: MongoDBClient, database: string, manipulator?: (documents: any[]) => any[]) {
        this.app = express();
        this.database = database;

        this.app.get('/:collection', async (req, res) => {
            const { collection } = req.params;
            const documents = await mongoDBClient.getDocuments(this.database, collection);
            if (_.isNil(documents)) {
                res.status(404).send();
                return;
            }
            res.send(_.isNil(manipulator) ? documents : manipulator(documents));
        });

        this.app.get('/:collection/:id', async (req, res) => {
            const { collection, id } = req.params;
            const document = await mongoDBClient.getDocument(this.database, collection, id);
            if (_.isNil(document)) {
                res.status(404).send();
                return;
            }
            res.send(_.isNil(manipulator) ? document : manipulator([document])[0]);
        });

        this.server = this.app.listen(port, () => { });
    }

    close() {
        this.server.close();
    }
}

