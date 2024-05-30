import { MongoClient } from 'mongodb';

export class MongoDBClient {
    private client: MongoClient;

    constructor(connectionString: string, tlsCertificateKeyFile: string) {
        this.client = new MongoClient(connectionString, {
            tls: true,
            tlsCAFile: tlsCertificateKeyFile
        });
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
            await this.close();
            return documents;
        } catch (error) {
            console.error(error);
            return [];
        }
    }
}