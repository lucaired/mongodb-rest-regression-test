import { MongoMemoryServer } from 'mongodb-memory-server';

export class InMemoryMongoDB {
    private mongodb: MongoMemoryServer | undefined;

    constructor() {
        this.mongodb = undefined;
    }

    async start(port?: number) {
        this.mongodb = await MongoMemoryServer.create(port ? {
            instance: {
                port,
            }
        } : {});
        return this.mongodb.getUri();
    }

    async stop(): Promise<boolean> {
        if (this.mongodb !== undefined) {
            return await this.mongodb.stop();
        }
        return true;
    }
}