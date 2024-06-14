import { describe, expect } from '@jest/globals';

import { InMemoryMongoDB } from './inMemoryMongoDB';
import { MongoDBClient } from './mongoDBClient';

describe('MongoDBClient', () => {
    it('should populate database and get documents', async () => {
        const mongoDB = new InMemoryMongoDB();
        const mongoDBuri = await mongoDB.start(2000);
        const mongoDBClient = new MongoDBClient(mongoDBuri, '');
        await mongoDBClient.populateDatabase('test', 'test', [
            { name: 'agatha', age: 42 },
            { name: 'bertha', age: 24 },
            { name: 'charles', age: 35 },
            { name: 'david', age: 29 },
            { name: 'elizabeth', age: 38 },
            { name: 'frank', age: 33 },
            { name: 'george', age: 40 },
            { name: 'hannah', age: 27 },
            { name: 'irene', age: 31 },
            { name: 'jack', age: 36 }
        ]);
        const docs = await mongoDBClient.getDocuments('test', 'test');
        expect(docs).toEqual(expect.arrayContaining([
            expect.objectContaining({ name: 'agatha', age: 42 }),
            expect.objectContaining({ name: 'bertha', age: 24 }),
            expect.objectContaining({ name: 'charles', age: 35 }),
            expect.objectContaining({ name: 'david', age: 29 }),
            expect.objectContaining({ name: 'elizabeth', age: 38 }),
            expect.objectContaining({ name: 'frank', age: 33 }),
            expect.objectContaining({ name: 'george', age: 40 }),
            expect.objectContaining({ name: 'hannah', age: 27 }),
            expect.objectContaining({ name: 'irene', age: 31 }),
            expect.objectContaining({ name: 'jack', age: 36 })
        ]));
        await mongoDB.stop();
    });
});