import { TodoSchema } from '../../core/domain/todo.ts';
import { Bson, Collection } from '../../utils/deps.ts';
import { ITodoService } from './../../core/interfaces/iTodoService.ts';
import storeContext from '../persistence/dbContext.ts';

export class TodoService implements ITodoService {
	private todosCollection: Collection<TodoSchema>;

	constructor() {
		this.todosCollection = storeContext.database.collection('todos');
	}

	async addTodo(todo: TodoSchema): Promise<string> {
		const id = await this.todosCollection.insertOne(todo);
		return id.toString();
	}

	async getTodos(): Promise<TodoSchema[]> {
		return await this.todosCollection.find().toArray();
	}

	async getTodo(id: string) {
		return await this.todosCollection.findOne({ _id: new Bson.ObjectId(id) });
	}

	async updateTodo(todo: TodoSchema) {
		const { matchedCount } = await this.todosCollection.updateOne(
			{
				_id: todo._id,
			},
			{
				$set: {
					text: todo.text,
				},
			}
		);
		return matchedCount;
	}

	async deleteTodo(id: string) {
		return await this.todosCollection.deleteOne({ _id: new Bson.ObjectId(id) });
	}
}
