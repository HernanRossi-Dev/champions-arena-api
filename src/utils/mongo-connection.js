'use strict';

import config from 'config';
import mongoose from 'mongoose';

let mongoConnection;

const getMongoConnection = async () => {
    if (mongoConnection) {
        return mongoConnection;
    }

    const mongoClient = await mongoose.connect(config.mongoDBUrl, { useNewUrlParser: true });
    mongoConnection = mongoClient.connection;
    mongoConnection.on('error', console.error.bind(console, 'MongoDB connection error:'));
    return mongoConnection
}

export default getMongoConnection;