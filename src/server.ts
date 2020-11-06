require('dotenv').config({path:__dirname+`/config/.env`});
import App from './app';
import Auth from './routes/auth';
import Animals from './routes/animals';
import Panel from './routes/panel';
import User from './routes/user';

const app = new App(
    parseInt(<string>process.env.PORT) || 5000,
        {
            animals:new Animals(),
            auth:new Auth(),
            panel: new Panel(),
            user: new User()
        }
    )

app.listen();
