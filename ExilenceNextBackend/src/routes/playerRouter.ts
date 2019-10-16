import Router from 'koa-router';
import selectedConfiguration from './../config/app.config';

const router: Router = new Router();

router
    .get('/', async (ctx, next) => {
        ctx.body = `!!! Config variable Production: ${selectedConfiguration.production}`;
    });

export = router;