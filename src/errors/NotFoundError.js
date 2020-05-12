'use strict';

class NotFoundError extends Error {
    constructor() {
        super();
        this.name = "NotFoundError";
        this.data = new Date();
        this.message = 'Data not found in MongoDB';
        this.status = 404;
    }
}

export default NotFoundError;