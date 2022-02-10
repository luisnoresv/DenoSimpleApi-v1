import { Todo } from './Todo.ts';
export interface ApiResponse {
	success: boolean;
	msg?: string;
	data?: Todo | Todo[];
}
