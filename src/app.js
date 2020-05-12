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

const setEnvironmentDecoding = () => {
  app.get('*.js', (req, res, next) => {
    req.url = `${req.url}.gz`;
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'text/javascript');
    next();
  });
  app.get('*.css', (req, res, next) => {
    req.url = `${req.url}.gz`;
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'text/css');
    next();
  });
}

const initServer = () => {
  if (process.env.NODE_ENV && process.env.NODE_ENV.trim() !== 'development') {
    setEnvironmentDecoding();
  }

  const expressOptions = {
    dotfiles: 'ignore',
    etag: false,
    index: false,
    maxAge: '1d',
    setHeaders: (res) => {
      res.set('x-timestamp', Date.now());
    }
  };

  app.use(expressOptions);
  app.use(bodyParser.json());
  
  app.listen(process.env.PORT || 8080, () => {
    console.log('App started on port 8080.');
  });
}

initServer();

app.use('/api/authenticate', AuthRoutes);
app.use('/api/characters', CharacterRoutes);
app.use('/api/users', UserRoutes);
