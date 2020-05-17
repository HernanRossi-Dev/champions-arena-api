'use strict'

import express from 'express';
import bodyParser from 'body-parser';
import SourceMapSupport from 'source-map-support';
import cors from 'cors';
import helmet from 'helmet';
import { CharacterRoutes, UserRoutes, AuthRoutes } from './api/index.js';

SourceMapSupport.install();

const app = express();
app.use(helmet());
app.use(cors());

const initServer = () => {

  app.use(bodyParser.json());

  app.listen(process.env.PORT || 8080, () => {
    console.log('App started on port 8080.');
  });
}

initServer();

app.use('/api/authenticate', AuthRoutes);
app.use('/api/characters', CharacterRoutes);
app.use('/api/users', UserRoutes);

export default app;