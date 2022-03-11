import { Bson } from '../../utils/deps.ts';

export interface Todo {
	_id: string | undefined;
	text: string;
}

export interface TodoSchema {
	_id?: Bson.ObjectId;
	text: string;
}
