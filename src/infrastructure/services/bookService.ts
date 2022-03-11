import { BookSchema } from './../../core/domain/book.ts';
import { Bson, Collection } from '../../utils/deps.ts';
import { IBookService } from './../../core/interfaces/iBookService.ts';
import storeContext from '../persistence/dbContext.ts';

export class BookService implements IBookService {
	private booksCollection: Collection<BookSchema>;

	constructor() {
		this.booksCollection = storeContext.database.collection('books');
	}

	async addBook(book: BookSchema) {
		const id = await this.booksCollection.insertOne(book);
		return id.toString();
	}

	async getBooks() {
		return await this.booksCollection.find().toArray();
	}

	async getCount(isbn: string) {
		return await this.booksCollection.countDocuments({ isbn });
	}

	async getBookByIsbn(isbn: string) {
		return await this.booksCollection.findOne({ isbn });
	}

	async getBookById(id: string) {
		return await this.booksCollection.findOne({
			_id: new Bson.ObjectId(id),
		});
	}

	async updateBook(book: BookSchema) {
		const { matchedCount } = await this.booksCollection.updateOne(
			{
				_id: book._id,
			},
			{
				$set: {
					title: book.title,
					url: book.url,
					author: book.author,
				},
			}
		);
		return matchedCount;
	}

	async deleteBook(isbn: string) {
		return await this.booksCollection.deleteOne({ isbn });
	}
}
