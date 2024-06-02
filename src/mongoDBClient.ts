import { MongoClient, ObjectId } from 'mongodb';

export class MongoDBClient {
    private client: MongoClient;

    constructor(connectionString: string, tlsCertificateKeyFile: string) {
        this.client = new MongoClient(connectionString);
    }

    private async connect() {
        await this.client.connect();
    }

    private async close() {
        await this.client.close();
    }

    async getDocuments(database: string, collection: string) {
        try {
            await this.connect();
            const documents = this.client.db(database).collection(collection).find().toArray();
            return documents;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async getDocument(database: string, collection: string, id: string) {
        try {
            await this.connect();
            console.log('Connected successfully to server');
            const document = this.client.db(database).collection(collection).findOne({ _id: new ObjectId(id) });
            return document;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async populateDatabase(database: string, collection: string, documents: any[]) {
        try {
            await this.connect();
            console.log('Connected successfully to server');
            await this.client.db(database).collection(collection).insertMany(documents);
        } catch (error) {
            console.error(error);
        }
    }
}