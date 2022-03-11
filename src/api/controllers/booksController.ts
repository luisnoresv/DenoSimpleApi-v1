import { BookSchema } from './../../core/domain/book.ts';
import { BookService } from './../../infrastructure/services/bookService.ts';
import { IBookService } from './../../core/interfaces/iBookService.ts';
import {
	Context,
	helpers,
	RouterMiddleware,
	Status,
} from '../../utils/deps.ts';
import { Book } from '../../core/domain/book.ts';
import { ApiResponse } from '../contracts/responses/apiResponse.ts';

export class BooksController {
	private bookService: IBookService;

	/**
	 *
	 */
	constructor() {
		this.bookService = new BookService();
	}

	createBook: RouterMiddleware<string> = async (context: Context) => {
		const { request, response } = context;
		const body = request.body();
		const bookRequest: Book = await body.value;

		if (
			!bookRequest.isbn ||
			!bookRequest.author ||
			!bookRequest.title ||
			!bookRequest.url
		) {
			context.throw(
				Status.BadRequest,
				'Incorrect book data. ISBN, title, url and author are all required'
			);
		}

		const count = await this.bookService.getCount(bookRequest.isbn);
		if (count > 0) {
			context.throw(Status.BadRequest, 'A book with that isbn already exists');
		}

		const book: BookSchema = {
			author: bookRequest.author,
			isbn: bookRequest.isbn,
			title: bookRequest.title,
			url: bookRequest.url,
		};

		const _id = await this.bookService.addBook(book);
		bookRequest._id = _id;
		response.status = Status.Created;
		response.body = {
			success: true,
			data: { ...bookRequest },
		} as ApiResponse<Book>;
	};

	getBook: RouterMiddleware<string> = async (context) => {
		const { response } = context;
		const { isbn } = helpers.getQuery(context, { mergeParams: true });

		const book = await this.bookService.getBookByIsbn(isbn);
		if (!book) {
			context.throw(Status.NotFound, 'Book not found');
		}

		const bookResponse: Book = {
			_id: book?._id?.toString(),
			author: book?.author!,
			isbn: book?.isbn!,
			title: book?.title!,
			url: book?.url!,
		};

		response.status = Status.OK;
		response.body = { success: true, data: bookResponse } as ApiResponse<Book>;
	};

	getBooks: RouterMiddleware<string> = async (context: Context) => {
		const books = await this.bookService.getBooks();

		if (!books) {
			context.throw(Status.NotFound, 'There is no books on the Database');
		}

		const booksResponse: Book[] = [];

		books.forEach((book) => {
			const bookResponse: Book = {
				_id: book._id?.toString(),
				author: book.author,
				isbn: book.isbn,
				title: book.title,
				url: book.url,
			};
			booksResponse.push(bookResponse);
		});

		context.response.status = Status.OK;
		context.response.body = {
			success: true,
			data: booksResponse,
		} as ApiResponse<Book>;
	};

	updateBook: RouterMiddleware<string> = async (context) => {
		const { response, request } = context;
		const { isbn } = helpers.getQuery(context, { mergeParams: true });

		const body = request.body();
		const book: Book = await body.value;
		const updates = Object.keys(book);
		const allowedUpdates = ['author', 'title', 'url'];
		const isValidOperation = updates.every((update) =>
			allowedUpdates.includes(update)
		);
		if (!isValidOperation) {
			context.throw(
				Status.BadRequest,
				'You can only update author or title or url'
			);
		}

		const bookFromRepo = await this.bookService.getBookByIsbn(isbn);
		if (!bookFromRepo) {
			context.throw(Status.NotFound, 'Book not found');
		} else {
			bookFromRepo.author = book.author;
			bookFromRepo.title = book.title;
			bookFromRepo.url = book.url;
			const matchedCount = await this.bookService.updateBook(bookFromRepo);
			if (matchedCount === 0) {
				context.throw(Status.NotFound, 'Book not found');
			}
		}

		response.status = Status.NoContent;
	};

	deleteBook: RouterMiddleware<string> = async (context) => {
		const { response } = context;
		const { isbn } = helpers.getQuery(context, { mergeParams: true });

		const deleteCount = await this.bookService.deleteBook(isbn);
		if (deleteCount === 0) {
			context.throw(Status.NotFound, 'Book not found');
		}

		response.status = Status.NoContent;
	};
}
