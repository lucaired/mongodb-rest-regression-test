import _ from 'lodash';
import assert from 'assert';

import { MongoDBClient } from "./mongodb";
import { RestClient } from "./rest";

export module Comparision {

    interface DocumentWithId {
        _id: string;
    }

    export async function compareChangeEffect() {
        const mongoClient =  new MongoDBClient('mongodb://localhost:27017', 'path/to/certificate.pem');
        const collection = await mongoClient.getDocuments('mydb', 'mycollection');
        const documentId = collection.map(doc => doc._id.toString());
        const localHttpClient = new RestClient('token', 'https://api.example.com');
        const devHttpClient = new RestClient('token', 'https://dev.api.example.com');
        for (const id of documentId) {
            const localDocument = await localHttpClient.get<DocumentWithId[]>(`document/${id}`);
            const devDocument = await devHttpClient.get<DocumentWithId[]>(`document/${id}`);
            if (!_.isNil(localDocument) && !_.isNil(devDocument)) {
                const localDocumentSanitized = _.flattenDeep(localDocument).sort();
                const devDocumentSanitized = _.flattenDeep(devDocument).sort();
                assert.deepStrictEqual(localDocumentSanitized, devDocumentSanitized);
            } else {
                throw new Error('Document not found on both stages');
            }
        }
    }
}