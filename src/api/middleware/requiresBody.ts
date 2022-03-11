import { Context, Status } from '../../utils/deps.ts';

const requiresBody = async (context: Context, next: () => Promise<unknown>) => {
	if (!context.request.hasBody) {
		context.throw(Status.BadRequest, 'Request body is required');
	}
	const body = context.request.body();
	if (body.type !== 'json') {
		context.throw(Status.UnsupportedMediaType, 'Content type must be JSON');
	}

	if (Object.keys(await body.value).length === 0) {
		context.throw(Status.BadRequest, 'Request body should not be empty');
	}

	await next();
};

export default requiresBody;
