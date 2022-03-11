import { TodoSchema } from './../domain/todo.ts';
export interface ITodoService {
	addTodo(todo: TodoSchema): Promise<string>;
	getTodos(): Promise<TodoSchema[]>;
	getTodo(id: string): Promise<TodoSchema | undefined>;
	updateTodo(todo: TodoSchema): Promise<number>;
	deleteTodo(id: string): Promise<number>;
}
