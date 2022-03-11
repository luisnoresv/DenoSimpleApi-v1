import { Middleware, Status } from '../../utils/deps.ts';

const notFoundMiddleware: Middleware = (context) => {
	context.throw(Status.NotFound, 'API not found');
};

export default notFoundMiddleware;
