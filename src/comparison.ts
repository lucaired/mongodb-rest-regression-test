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
        mongodbCertificate: string;
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
        const mongoClient =  new MongoDBClient(mongodbConnection, mongodbCertificate);
        const collection = await mongoClient.getDocuments(mongodbDatabase, mongodbCollection);
        const documentId = collection.map(doc => doc._id.toString());
        const localHttpClient = new RestClient(bearerToken, localRestApi);
        const devHttpClient = new RestClient(bearerToken, devRestApi);
        for (const id of documentId) {
            const localDocument = await localHttpClient.get<DocumentWithId[]>(`document/${id}`);
            const devDocument = await devHttpClient.get<DocumentWithId[]>(`document/${id}`);
            if (!_.isNil(localDocument) && !_.isNil(devDocument)) {
                const localDocumentSanitized = _.flattenDeep(localDocument).sort();
                const devDocumentSanitized = _.flattenDeep(devDocument).sort();
                assert.deepStrictEqual(localDocumentSanitized, devDocumentSanitized);
            } else {
                throw new Error(`Document ${id} not found on both stages`);
            }
        }
    }
}