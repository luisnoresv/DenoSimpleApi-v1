import { ApiResponse } from './../contracts/responses/apiResponse.ts';
import { Todo, TodoSchema } from './../../core/domain/todo.ts';
import { TodoService } from './../../infrastructure/services/todoService.ts';
import { ITodoService } from './../../core/interfaces/iTodoService.ts';
import {
	Context,
	helpers,
	RouterMiddleware,
	Status,
} from '../../utils/deps.ts';

export class TodosController {
	private todoService: ITodoService;

	/**
	 *
	 */
	constructor() {
		this.todoService = new TodoService();
	}

	createTodo: RouterMiddleware<string> = async (context: Context) => {
		const { request, response } = context;
		const body = request.body();
		const todoRequest: Todo = await body.value;

		if (!todoRequest.text) {
			context.throw(Status.BadRequest, 'Incorrect todo data. Text is required');
		}

		const todo: TodoSchema = {
			text: todoRequest.text,
		};

		const _id = await this.todoService.addTodo(todo);
		todoRequest._id = _id;

		response.status = Status.Created;
		response.body = {
			success: true,
			data: { ...todoRequest },
		} as ApiResponse<Todo>;
	};

	getTodo: RouterMiddleware<string> = async (context) => {
		const { response } = context;
		const { id } = helpers.getQuery(context, { mergeParams: true });

		const todo = await this.todoService.getTodo(id);
		if (!todo) {
			context.throw(Status.NotFound, 'Todo not found');
		}

		const todoResponse: Todo = {
			_id: todo?._id?.toString(),
			text: todo?.text!,
		};

		response.status = Status.OK;
		response.body = { success: true, data: todoResponse } as ApiResponse<Todo>;
	};

	getTodos: RouterMiddleware<string> = async (context: Context) => {
		const todos = await this.todoService.getTodos();

		if (!todos) {
			context.throw(Status.NotFound, 'There is no books on the Database');
		}

		const todosResponse: Todo[] = [];

		todos.forEach((todo) => {
			const bookResponse: Todo = {
				_id: todo._id?.toString(),
				text: todo.text,
			};
			todosResponse.push(bookResponse);
		});

		context.response.status = Status.OK;
		context.response.body = {
			success: true,
			data: todosResponse,
		} as ApiResponse<Todo>;
	};

	updateTodo: RouterMiddleware<string> = async (context) => {
		const { response, request } = context;
		const { id } = helpers.getQuery(context, { mergeParams: true });

		const body = request.body();
		const todo: Todo = await body.value;
		const updates = Object.keys(todo);
		const allowedUpdates = ['text'];
		const isValidOperation = updates.every((update) =>
			allowedUpdates.includes(update)
		);
		if (!isValidOperation) {
			context.throw(
				Status.BadRequest,
				'You can only update author or title or url'
			);
		}

		const todoFromRepo = await this.todoService.getTodo(id);
		if (!todoFromRepo) {
			context.throw(Status.NotFound, 'Todo not found');
		} else {
			todoFromRepo.text = todo.text;
			const matchedCount = await this.todoService.updateTodo(todoFromRepo);
			if (matchedCount === 0) {
				context.throw(Status.NotFound, 'Book not found');
			}
		}
		response.status = Status.NoContent;
	};

	deleteTodo: RouterMiddleware<string> = async (context) => {
		const { response } = context;
		const { id } = helpers.getQuery(context, { mergeParams: true });

		const deleteCount = await this.todoService.deleteTodo(id);
		if (deleteCount === 0) {
			context.throw(Status.NotFound, 'Book not found');
		}
		response.status = Status.NoContent;
	};
}
