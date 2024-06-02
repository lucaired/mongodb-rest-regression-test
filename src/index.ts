import { InMemoryMongoDB } from './inMemoryMongoDB';
import { MongoDBClient } from './mongoDBClient';

async function testDB() {
  const mongoDB = new InMemoryMongoDB();
  const mongoDBuri = await mongoDB.start();
  console.log(mongoDBuri);
  const mongoDBClient = new MongoDBClient(mongoDBuri, '');
  mongoDBClient.populateDatabase('test', 'test', [
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
  console.log(docs);
  mongoDB.stop();
}
testDB();