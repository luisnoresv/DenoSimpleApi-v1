import { MongoClient } from '../../utils/deps.ts';
import { DB } from '../../api/configuration/appSettings.ts';

const dbUri = `mongodb+srv://${DB.user}:${DB.password}@${DB.host}/${DB.name}?authMechanism=SCRAM-SHA-1`;

class MongoDbConext {
	private client: MongoClient;

	constructor(private dbHostUrl: string, private dbName: string) {
		this.client = {} as MongoClient;
	}

	async connect() {
		const client = new MongoClient();
		await client.connect(this.dbHostUrl);
		this.client = client;
	}

	get database() {
		return this.client.database(this.dbName);
	}
}

const dbContext = new MongoDbConext(dbUri, DB.name);
await dbContext.connect();

export default dbContext;
