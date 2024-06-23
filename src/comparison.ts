import _ from 'lodash';
import assert from 'assert';

import { MongoDBClient } from "./mongoDBClient";
import { RestClient } from "./rest";

export module Comparision {

    interface DocumentWithId {
        _id: string;
    }

    interface SUTSetup {
        mongodbConnection: string;
        mongodbCertificate: string | undefined;
        mongodbDatabase: string;
        mongodbCollection: string;
        localRestApi: string;
        devRestApi: string;
        bearerToken: string;
    }

    export async function compareChangeEffect(SUTSetup: SUTSetup) {
        const {
            mongodbConnection,
            mongodbCertificate,
            mongodbDatabase,
            mongodbCollection,
            localRestApi,
            devRestApi,
            bearerToken
        } = SUTSetup;
        const mongoClient = new MongoDBClient(mongodbConnection, mongodbCertificate);
        const collection = await mongoClient.getDocuments(mongodbDatabase, mongodbCollection);
        const documentIds = collection.map(doc => doc._id.toString());
        const localHttpClient = new RestClient(bearerToken, localRestApi);
        const devHttpClient = new RestClient(bearerToken, devRestApi);
        const diffErrors = [];
        for (const id of documentIds) {
            const localDocument = await localHttpClient.get<DocumentWithId[]>(`${mongodbCollection}/${id}`);
            const devDocument = await devHttpClient.get<DocumentWithId[]>(`${mongodbCollection}/${id}`);
            if (!_.isNil(localDocument) && !_.isNil(devDocument)) {
                try {
                    assert.deepStrictEqual(localDocument, devDocument);
                } catch (error) {
                    diffErrors.push(id);
                }
            } else {
                diffErrors.push(id);
            }
        }
        return diffErrors;
    }
}