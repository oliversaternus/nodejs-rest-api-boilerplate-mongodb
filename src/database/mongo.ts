import { MongoClient } from "mongodb";
import * as path from "path";
import * as fs from "fs";

let config: any;

try {
    config = JSON.parse(fs.readFileSync(path.join(__dirname, '../', '../', 'config.json'), 'utf8'));
} catch (e) {
    console.log('No config provided. Using default mongodb connection URI');
}

const url: string = config?.connectionURI || "mongodb://localhost:27017";
export let conn: MongoClient;

export async function connectDB(): Promise<boolean> {
    try {
        conn = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        return true;
    } catch (e) {
        return false;
    }
}
