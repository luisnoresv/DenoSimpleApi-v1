import { TodosController } from './todosController.ts';
import { BooksController } from './booksController.ts';
import { API } from './../configuration/appSettings.ts';
import { Router } from '../../utils/deps.ts';
import requiresBody from '../middleware/requiresBody.ts';

const router = new Router();

const booksController = new BooksController();

// BooksController Routes
router
	.post(`/api/${API.version}/books`, requiresBody, booksController.createBook)
	.get(`/api/${API.version}/books`, booksController.getBooks)
	.get(`/api/${API.version}/books/:isbn`, booksController.getBook)
	.put(
		`/api/${API.version}/books/:isbn`,
		requiresBody,
		booksController.updateBook
	)
	.delete(`/api/${API.version}/books/:isbn`, booksController.deleteBook);

// TodosController Routes
const todosController = new TodosController();

router
	.post(`/api/${API.version}/todos`, requiresBody, todosController.createTodo)
	.get(`/api/${API.version}/todos`, todosController.getTodos)
	.get(`/api/${API.version}/todos/:id`, todosController.getTodo)
	.put(
		`/api/${API.version}/todos/:id`,
		requiresBody,
		todosController.updateTodo
	)
	.delete(`/api/${API.version}/todos/:id`, todosController.deleteTodo);

export default router;
