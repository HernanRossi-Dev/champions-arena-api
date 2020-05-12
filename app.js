'use strict'

import express from 'express';
import bodyParser from 'body-parser';
import SourceMapSupport from 'source-map-support';
import path from 'path';
import helmet from 'helmet';
import AuthController from './src/controllers/AuthController.js';
import CharactersController from './src/controllers/CharactersController.js';
import UserController from './src/controllers/UserController.js';

SourceMapSupport.install();

const app = express();
app.use(helmet());

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

//  app.use(express.static(path.join(__dirname, '../../dist'), expressOptions));
  app.use(bodyParser.json());
  
  app.listen(process.env.PORT || 8080, () => {
    console.log('App started on port 8080.');
  });
  }

initServer();

app.get('/api/authenticate', AuthController.authenticate);
app.use(AuthController.authError);
app.get('/api/characters/:id', CharactersController.getCharacter);
app.get('/api/characters', CharactersController.getCharacters);
app.get('/api/users', UserController.getUsers);
app.get('/api/user', UserController.getUser);
app.get('*', (req, res) => {
  res.sendFile(path.resolve('./index.html'));
});

const jwtCheck = AuthController.jwtCheck();
app.use(jwtCheck);

app.post('/api/users', UserController.createUser);
app.post('/api/user/basic', UserController.createUserBasic);
app.delete('/api/users', UserController.deleteUsers);
app.delete('/api/users/:name', UserController.deleteUser);

app.put('/api/characters/:id', CharactersController.updateCharacter);
app.post('/api/characters', CharactersController.createCharacter);
app.delete('/api/characters/:id', CharactersController.deleteCharacter);
app.delete('/api/characters', CharactersController.deleteCharacters);
