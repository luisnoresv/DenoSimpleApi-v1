const env = Deno.env.toObject();

export const DB = {
	name: env.DB_NAME || '',
	host: env.DB_HOST || '',
	port: env.DB_PORT || '',
	user: env.DB_USER || '',
	password: env.DB_USER_PWD || '',
};

export const API = {
	version: env.API_VERSION || '',
	port: env.PORT || 5000,
	host: env.HOST || 'localhost',
};
