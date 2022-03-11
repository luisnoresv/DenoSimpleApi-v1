export interface ApiResponse<T> {
	success: boolean;
	msg?: string;
	data?: T | T[];
}
