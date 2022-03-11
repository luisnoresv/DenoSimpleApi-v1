import { Bson } from '../../utils/deps.ts';

export interface Book {
	_id: string | undefined;
	title: string;
	url: string;
	author: string;
	isbn: string;
}

export interface BookSchema {
	_id?: Bson.ObjectId;
	title: string;
	url: string;
	author: string;
	isbn: string;
}
