const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const controller = require('./controller');

var cors = require('kcors');

const app = new Koa();

// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

app.use(bodyParser());
app.use(cors());
app.use(controller());

app.listen(8086);
console.log('app started at port 8086...');
