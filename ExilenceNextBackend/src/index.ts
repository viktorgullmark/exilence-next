import Koa from 'koa';
import Router from './routes/router';
import logger from 'koa-logger';
import bodyparser from 'koa-bodyparser';

const app = new Koa();
app.use(logger());
app.use(bodyparser());

app.use(Router);

// Catch all errors handler
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = err.message;
        ctx.app.emit('error', err, ctx);
    }
});

app.listen(3001);

console.log('Server running on port 3001');