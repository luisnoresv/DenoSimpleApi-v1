import { Router, helpers } from 'https://deno.land/x/oak/mod.ts';
import { Todo } from '../models/Todo.ts';
import { ApiResponse } from '../models/ApiResponse.ts';

const router = new Router();

let todos: Todo[] = [];

router.get('/api/v1/todos', ({ response }) => {
	response.status = 200;
	response.body = { success: true, data: todos } as ApiResponse;
});

router.get('/api/v1/todos/:id', (context) => {
	const { response } = context;
	const { id } = helpers.getQuery(context, { mergeParams: true });

	if (id) {
		const todoFromStore = todos.filter((t) => t.id === id);
		if (!todoFromStore) {
			response.status = 404;
			response.body = { success: false, msg: 'Not found' } as ApiResponse;
		}
		response.status = 200;
		response.body = {
			success: true,
			data: todoFromStore,
		} as ApiResponse;
	} else {
		response.status = 400;
		response.body = {
			success: false,
			msg: 'You need to provide an id',
		} as ApiResponse;
	}
});

router.post('/api/v1/todos', async ({ request, response }) => {
	const body = request.body({ type: 'json' });
	const value = await body.value;

	if (!request.hasBody) {
		response.status = 400;
		response.body = {
			success: false,
			msg: 'You need to send any data',
		} as ApiResponse;
	} else {
		const newTodo: Todo = {
			id: crypto.randomUUID(),
			text: value,
		};

		todos.push(newTodo);

		response.status = 201;
		response.body = {
			success: true,
			data: newTodo,
		} as ApiResponse;
	}
});

router.put('/api/v1/todos/:id', async (context) => {
	const { request, response } = context;
	const { id } = helpers.getQuery(context, { mergeParams: true });
	const body = request.body({ type: 'json' });
	const value = await body.value;

	if (id) {
		if (!request.hasBody) {
			response.status = 404;
			response.body = {
				success: false,
				msg: 'You need to provide a value',
			} as ApiResponse;
		} else {
			const index = todos.findIndex((todo) => {
				return todo.id === id;
			});
			todos[index] = { id: todos[index].id, text: value };

			response.status = 204;
			response.body = { success: true, msg: 'Updated Todo' } as ApiResponse;
		}
	} else {
		response.status = 400;
		response.body = {
			success: false,
			msg: 'You need to provide an id',
		} as ApiResponse;
	}
});

router.delete('/api/v1/todos/:id', (context) => {
	const { response } = context;
	const { id } = helpers.getQuery(context, { mergeParams: true });

	if (id) {
		todos = todos.filter((todo) => todo.id !== id);

		response.status = 204;
		response.body = { success: true, msg: 'Deleted Todo' } as ApiResponse;
	} else {
		response.status = 400;
		response.body = {
			success: false,
			msg: 'You need to provide an id',
		} as ApiResponse;
	}
});

export default router;
