import { InMemoryMongoDB } from "./inMemoryMongoDB";
import { MongoDBClient } from "./mongoDBClient";
import { TestServer } from "./testServer";

describe('testServers', () => {
    it('should return documents', async () => {
        const mongoDB = new InMemoryMongoDB();
        const mongoDBuri = await mongoDB.start();
        const mongoDBClient = new MongoDBClient(mongoDBuri, '');
        await mongoDBClient.populateDatabase('servertest', 'test', [
            { name: 'agatha', age: 42 }
        ]);
        const documents = await mongoDBClient.getDocuments('servertest', 'test');
        expect(documents).toEqual(expect.arrayContaining([
            expect.objectContaining({ name: 'agatha', age: 42 })
        ]));
        new TestServer(
            3000,
            mongoDBClient,
            'servertest'
        );
        const allDocuments = await fetch('http://localhost:3000/test');
        const allDocumentsJson = await allDocuments.json();
        expect(allDocumentsJson).toEqual(expect.arrayContaining([
            expect.objectContaining({ name: 'agatha', age: 42 })
        ]));
        const agatha = documents[0];
        const response = await fetch('http://localhost:3000/test/' + agatha._id);
        const document = await response.json();
        expect(document).toEqual(expect.objectContaining({ name: 'agatha', age: 42 }));
        mongoDBClient.close();
    });
});