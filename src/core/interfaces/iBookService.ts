import { Book, BookSchema } from '../domain/book.ts';

export interface IBookService {
	addBook(book: BookSchema): Promise<string>;
	getBooks(): Promise<BookSchema[]>;
	getCount(isbn: string): Promise<number>;
	getBookByIsbn(isbn: string): Promise<BookSchema | undefined>;
	getBookById(id: string): Promise<BookSchema | undefined>;
	updateBook(book: BookSchema): Promise<number>;
	deleteBook(isbn: string): Promise<number>;
}
