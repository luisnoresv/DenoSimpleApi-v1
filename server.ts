import { Application } from 'https://deno.land/x/oak/mod.ts';
// for load .env files enable
// import { load } from 'https://deno.land/x/denv/mod.ts';
import todosRoutes from './routes/todos.routes.ts';

// await load({
// 	/** The path of the env file, defaults to ".env" */
// 	path: '.env',
// 	/** If true, won't overwrite existing variables */
// 	priorityEnv: false,
// 	/** Will not throw an error if file is not found */
// 	ignoreMissingFile: false,
// 	/** If true, will verify the final environment against the example file */
// 	verifyAgainstExample: false,
// 	/** If true, will fallback to the example file */
// 	defaultToExample: false,
// 	/** Path to example file, defaults to ".env.example" */
// 	exampleFile: '.env.example',
// });

const env = Deno.env.toObject();

const PORT = env.PORT || 5000;
const HOST = env.HOST || 'localhost';

const app = new Application();

// To execute middleware this should be async
app.use(async (ctx, next) => {
	console.log('Custom Middleware');
	await next();
});

app.use(todosRoutes.routes());
app.use(todosRoutes.allowedMethods());

console.log(`The app is running on http://${HOST}:${PORT}`);

await app.listen(`${HOST}:${PORT}`);
