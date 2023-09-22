import cors from 'cors';
import dotenv from 'dotenv';
import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from 'express';
import mongoose, { ConnectOptions } from 'mongoose';

import { StrictAuthProp } from '@clerk/clerk-sdk-node';

import { router as searchRoutes } from './routes/search-routes';
import { router as userRoutes } from './routes/user-routes';

const app = express();

declare global {
  namespace Express {
    interface Request extends StrictAuthProp {}
  }
}

dotenv.config()

app.use(cors());
app.use(express.json());

app.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
} );

app.use('/users', userRoutes)
app.use('/search', searchRoutes)

app.use((err: ErrorRequestHandler & { stack: any }, req: Request, res: Response, next: NextFunction) => {
  console.log(123)
  console.error(err?.stack);
  res.status(401).send('Unauthenticated!');
});

// start the Express server
app.listen( process.env.PORT, () => {
    mongoose.Promise = global.Promise;
    mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true} as ConnectOptions);        
    console.log( `server started at http://localhost:${process.env.PORT}` );
} );