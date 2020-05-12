'use strict';

class MongoDBError extends Error {
    constructor() {
        super();
        this.name = "MongoDBError";
        this.data = new Date();
        this.message = 'MongoDB encountered and error!';
        this.status = 422;
    }
}

export default MongoDBError;