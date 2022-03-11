import { Application, log } from './utils/deps.ts';
import { API } from './api/configuration/appSettings.ts';
import responseMiddleware from './api/middleware/response.ts';
import loggerMiddleware from './api/middleware/logger.ts';
import timingMiddleware from './api/middleware/timing.ts';
import errorMiddleware from './api/middleware/error.ts';
import router from './api/controllers/routes.ts';
import notFoundMiddleware from './api/middleware/notFound.ts';

const app = new Application();

app.use(responseMiddleware);
app.use(loggerMiddleware);
app.use(timingMiddleware);
app.use(errorMiddleware);
app.use(router.routes());
app.use(router.allowedMethods());
app.use(notFoundMiddleware);

log.info(`Listening on ${API.host}:${API.port}`);
await app.listen(`${API.host}:${API.port}`);
