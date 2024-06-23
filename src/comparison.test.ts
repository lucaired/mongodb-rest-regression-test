import { describe, expect } from '@jest/globals';
import { InMemoryMongoDB } from './inMemoryMongoDB';
import { MongoDBClient } from './mongoDBClient';
import { TestServer } from './testServer';
import { Comparision } from './comparison';

describe('comparison', () => {
    it('should not throw an error when servers are equal', async () => {
        const mongoDB = new InMemoryMongoDB();
        const mongoDBuri = await mongoDB.start(2001);
        const mongoDBClient = new MongoDBClient(mongoDBuri, '');
        await mongoDBClient.populateDatabase('test', 'test', [
            { name: 'test' }
        ]);
        const server1 = new TestServer(
            3001,
            mongoDBClient,
            'test'
        );
        const server2 = new TestServer(
            3002,
            mongoDBClient,
            'test'
        );
        const SUTSetup = {
            mongodbConnection: mongoDBuri,
            mongodbCertificate: '',
            mongodbDatabase: 'test',
            mongodbCollection: 'test',
            localRestApi: 'http://localhost:3001',
            devRestApi: 'http://localhost:3002',
            bearerToken: 'test',
        };
        await expect(Comparision.compareChangeEffect(SUTSetup)).resolves.not.toThrow();
        server1.close();
        server2.close();
    });
    it('should throw an error on different collections', async () => {
        const mongoDB = new InMemoryMongoDB();
        const mongoDBuri = await mongoDB.start(2003);
        const mongoDBClient = new MongoDBClient(mongoDBuri, '');
        await mongoDBClient.populateDatabase('test', 'test', [{ name: 'test' }]);
        new TestServer(
            3003,
            mongoDBClient,
            'test',
            (documents) => documents.map((document) => ({ ...document, name: document.name.toUpperCase() }))
        );
        new TestServer(
            3004,
            mongoDBClient,
            'test'
        );
        const SUTSetup = {
            mongodbConnection: mongoDBuri,
            mongodbCertificate: '',
            mongodbDatabase: 'test',
            mongodbCollection: 'test',
            localRestApi: 'http://localhost:3003',
            devRestApi: 'http://localhost:3004',
            bearerToken: 'test',
        };
        const diffErrors = await Comparision.compareChangeEffect(SUTSetup);
        expect(diffErrors).toHaveLength(1);
    });
});