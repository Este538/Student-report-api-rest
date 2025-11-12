import express from 'express';
import morgan from "morgan";
import pkg from '../package.json' with {type:'json'};
import studentRoute from '../src/routes/student.route.js';
import usersRoute from '../src/routes/user.route.js';

import helmet from 'helmet';

const app = express();


app.use(morgan('dev'));

app.use(express.json());

app.set('pkg', pkg);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "http://localhost:4000"],
      // Otros directivos...
    },
  },
}));



app.get('/',(req, res)=>{
    res.json({
        author:      app.get('pkg').author,
        description: app.get('pkg').description,
        version:     app.get('pkg').version,
        name:        app.get('pkg').name,
    });
});

app.use('/api/students', studentRoute);
app.use('/api/users', usersRoute);

export default app;