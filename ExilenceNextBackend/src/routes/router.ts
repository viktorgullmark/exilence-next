import Router from 'koa-router';
import PlayerRouter from './playerRouter';

const apiRouter = new Router({ prefix: '/api' });
apiRouter.use('/players', PlayerRouter.routes());

export default apiRouter.routes();