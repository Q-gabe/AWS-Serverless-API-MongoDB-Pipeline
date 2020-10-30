'use strict';

require('dotenv').config({path:'./.env'});
const connectToDatabase = require('./database/database');
const Pet = require('./database/models/pet.model');

module.exports.healthcheck = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false; // Send res immediately
    callback(null, "Hello from API server");
    return;
};

module.exports.create = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false; // Send res immediately
    if (!event.body) {
        callback(null, {
            statusCode: 400,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Could not create the pet: Request body empty.\n'
        })
        return;
    }
    let data;
    try {
        data = JSON.parse(event.body)
    } catch (err) {
        callback(null, {
            statusCode: 400,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Could not create the pet: Failed to parse JSON request body.\n'
        })
        return;
    }
    if (data) {
        // Check format
        if (!(data.hasOwnProperty('name') && 
            data.hasOwnProperty('species') && 
            data.hasOwnProperty('age') && 
            data.hasOwnProperty('status'))) {
            callback(null, {
                statusCode: 400,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Could not create the pet: Missing required fields.\n'
            })
            return;
        }
        // Check field types
        if (!(typeof data.name == 'string' &&
            typeof data.species == 'string' &&
            typeof data.age == 'number' &&
            typeof data.status == 'string')) {
            callback(null, {
                statusCode: 400,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Could not create the pet: Fields are of the wrong type, please check schema.\n'
            })
            return;
        }
        connectToDatabase().then(() => {
            Pet.create(data)
            .then(pet => {
                callback(null, {
                    statusCode: 200,
                    body: JSON.stringify({ pet_id: pet._id }),
                })
                return;
            })
            .catch(err => {
                callback(null, {
                    statusCode: err.statusCode || 500,
                    headers: { 'Content-Type': 'text/plain' },
                    body: `Could not create the pet: Internal Server Error. Error:${err} \n`
                })
                return;
            });
        });
    }
};

module.exports.getOne = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false; // Send res immediately
    connectToDatabase().then(() => {
        Pet.findById(event.pathParameters.id)
        .then(pet => {
            if (!pet) {
                callback(null, {
                    statusCode: 404,
                    headers: { 'Content-Type': 'text/plain' },
                    body: `Could not fetch the pet: No pet with id ${event.pathParameters.id}\n`
                });
                return;
            } else {
                callback(null, {
                    statusCode: 200,
                    body: JSON.stringify(pet)
                });
                return;
            }            
        })
        .catch(err => {
            callback(null, {
                statusCode: err.statusCode || 500,
                headers: { 'Content-Type': 'text/plain' },
                body: `Could not fetch the pet: Internal Server Error. Error:${err} \n`
            });
            return;
        });
    });
};

module.exports.getAll = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false; // Send res immediately
    connectToDatabase().then(() => {
        Pet.find()
        .then(pets => {
                callback(null, {
                    statusCode: 200,
                    body: JSON.stringify(pets)
                });
                return;
            }
        )
        .catch(err => {
            callback(null, {
                statusCode: err.statusCode || 500,
                headers: { 'Content-Type': 'text/plain' },
                body: `Could not fetch all pets: Internal Server Error. Error:${err} \n`
            });
            return;
        });
    });
};

module.exports.update = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false; // Send res immediately
    if (!event.body) {
        callback(null, {
            statusCode: 400,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Could not update the pet: Request body empty.\n'
        });
        return;
    }
    let data;
    try {
        console.log(event.body)
        data = JSON.parse(event.body)
    } catch (err) {
        callback(null, {
            statusCode: 400,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Could not update the pet: Failed to parse JSON request body.\n'
        });
        return;
    }
    if (data) {
        // Check format
        if (!(data.hasOwnProperty('name') && 
            data.hasOwnProperty('species') && 
            data.hasOwnProperty('age') && 
            data.hasOwnProperty('status'))) {
            callback(null, {
                statusCode: 400,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Could not update the pet: Missing required fields.\n'
            })
            return;
        }
        // Check field types
        if (!(typeof data.name == 'string' &&
            typeof data.species == 'string' &&
            typeof data.age == 'number' &&
            typeof data.status == 'string')) {
            callback(null, {
                statusCode: 400,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Could not update the pet: Fields are of the wrong type, please check schema.\n'
            })
            return;
        }
        connectToDatabase().then(() => {
            Pet.findByIdAndUpdate(
                event.pathParameters.id,
                data,
                {
                    new: true
                }
            )
            .then(pet => {
                if (!pet) {
                    callback(null, {
                        statusCode: 404,
                        headers: { 'Content-Type': 'text/plain' },
                        body: `Could not update the pet: No pet with id ${event.pathParameters.id}\n`
                    });
                    return;
                } else {
                    callback(null, {
                        statusCode: 200,
                        headers: { 'Content-Type': 'text/plain' },
                        body: `Successfully updated pet with id ${event.pathParameters.id}.\n`
                    });
                    return;
                } 
            })
            .catch(err => {
                callback(null, {
                    statusCode: err.statusCode || 500,
                    headers: { 'Content-Type': 'text/plain' },
                    body: `Could not update the pet: Internal Server Error. Error:${err} \n`
                });
                return;
            });
        });
    }
};

module.exports.delete = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false; // Send res immediately
    connectToDatabase().then(() => {
        Pet.findByIdAndRemove(event.pathParameters.id)
        .then(pet => {
            if (!pet) {
                callback(null, {
                    statusCode: 404,
                    headers: { 'Content-Type': 'text/plain' },
                    body: `Could not delete the pet: No pet with id ${event.pathParameters.id}\n`
                });
                return;
            } else {
                callback(null, {
                    statusCode: 200,
                    headers: { 'Content-Type': 'text/plain' },
                    body: `Successfully deleted the pet with id ${event.pathParameters.id}.\n`
                });
                return;
            }
        })
        .catch(err => {
            callback(null, {
                statusCode: err.statusCode || 500,
                headers: { 'Content-Type': 'text/plain' },
                body: `Could not delete the pet: Internal Server Error. Error:${err} \n`
            });
            return;
        });
    });
};

// Not documented or tested - used to purge database for testing purposes.
// ! If you are deploying this, please remove this function.
module.exports.deleteAll = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false; // Send res immediately
    connectToDatabase().then(() => {
        Pet.deleteMany({})
        .then(() => {
            callback(null, {
                statusCode: 200,
                headers: { 'Content-Type': 'text/plain' },
                body: `Successfully purged database.\n`
            });
            return;
        })
        .catch(err => {
            callback(null, {
                statusCode: err.statusCode || 500,
                headers: { 'Content-Type': 'text/plain' },
                body: `Could not purge database: Internal Server Error. Error:${err} \n`
            });
            return;
        });
    });
};
