require('dotenv').config({path:__dirname+`/config/.env`});
import App from './app';
import Auth from './routes/auth';
import Animals from './routes/animals';
import Panel from './routes/panel';

const app = new App(
    parseInt(<string>process.env.PORT) || 5000,
        {
            animals:new Animals(),
            auth:new Auth(),
            panel: new Panel()
        }
    )

app.listen();
