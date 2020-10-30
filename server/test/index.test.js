const request = require('supertest');
const assert = require('chai').assert;

const handler = require('../handler')

// Static events for test
const wrongJson_missingField= { name: "Doggo", age: 10, status: "Sleeping" };
const wrongJson_wrongType = { name: "Doggo", species: "Dog", age: "ten", status: "Sleeping" };

const correctJson1_name = "4567456"
const correctJson1_species = "5467454"
const correctJson1_age = -10
const correctJson1_status = "S l e e p i n g 1 2 3"
const correctedJson1_status = "Sleeping123"
const correctJson1 = { name: correctJson1_name, species: correctJson1_species, age: correctJson1_age, status: correctJson1_status };
const correctedJson1 = { name: correctJson1_name, species: correctJson1_species, age: correctJson1_age, status: correctedJson1_status };

const correctJson2_name = "Minmo"
const correctJson2_species = "Cat"
const correctJson2_age = 1
const correctJson2_status = "Growing healthy and strong" 
const correctedJson2_name = "Wang Ming Mo"
const correctedJson2_species = "Cat"
const correctedJson2_age = 1
const correctedJson2_status = "Still growing healthy and strong" 
const correctJson2 = { name: correctJson2_name, species: correctJson2_species, age: correctJson2_age, status: correctJson2_status };
const correctedJson2 = { name: correctedJson2_name, species: correctedJson2_species, age: correctedJson2_age, status: correctedJson2_status };

const correctJson3_name = "Li\'l Sebastian"
const correctJson3_species = "Mini-horse"
const correctJson3_age = 25
const correctJson3_status = "Crossed the rainbow bridge. RIP Little Sebastian"
const correctJson3 = { name: correctJson3_name, species: correctJson3_species, age: correctJson3_age, status: correctJson3_status };
const correctedJson3 = { name: correctJson3_name, species: correctJson3_species, age: correctJson3_age, status: correctJson3_status };

const addr = process.env.TEST_ADDRESS || 'http://localhost:3000/dev'
const server = request(addr);

let createdId1, createdId2, createdId3, uniqueId;

describe("Preparation: Purging test DB", () => {
    it("Purging complete.", (done) => {
        server.delete('/pet/purge')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                return done();
            })
    }).timeout(20000);
})

describe("handler healthcheck()", () => {
	it("should return 200 response with appropriate Hello on GET", (done) => {
        server.get('')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body, 'Hello from API server');
                return done();
            });
    }).timeout(20000);
})

describe("handler create()", () => {
    // INVALID TEST CASES
	it("should return 400 error with appropriate message for empty request body", (done) => {
        server.post('/pet')
            .type("json")
            .send(null)
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.text, "Could not create the pet: Request body empty.\n");
                return done();
            });
    }).timeout(20000);

    it("should return 400 error with appropriate message for missing schema fields", (done) => {
        server.post('/pet')
            .type("json")
            .send(wrongJson_missingField)
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.text, "Could not create the pet: Missing required fields.\n");
                return done();
            });
    }).timeout(20000);

    it("should return 400 error with appropriate message for wrong schema type", (done) => {
        server.post('/pet')
            .type("json")
            .send(wrongJson_wrongType)
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.text, "Could not create the pet: Fields are of the wrong type, please check schema.\n");
                return done();
            });
    }).timeout(20000);

    // VALID TEST CASES
    it("should return 200 response with created pet ID for valid input (Test 1)", (done) => {
        server.post('/pet')
            .type("json")
            .send(correctJson1)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.isTrue(res.body.hasOwnProperty('pet_id'));
                createdId1 = res.body.pet_id;
                return done();
            });
    }).timeout(20000);

    it("should return 200 response with created pet ID for valid input (Test 2)", (done) => {
        server.post('/pet')
            .type("json")
            .send(correctJson2)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.isTrue(res.body.hasOwnProperty('pet_id'));
                createdId2 = res.body.pet_id;
                return done();
            });
    }).timeout(20000);

    it("should return 200 response with created pet ID for valid input (Test 3)", (done) => {
        server.post('/pet')
            .type("json")
            .send(correctJson3)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.isTrue(res.body.hasOwnProperty('pet_id'));
                createdId3 = res.body.pet_id;
                return done();
            });
    }).timeout(20000);

    after(() => {
        //Generate unique id
        let unique = createdId1
        i = 1;
        while (unique === createdId1 ||
            unique === createdId2 ||
            unique === createdId3) {
            unique = unique.slice(0, -1) + i;
            i++;
        }
        uniqueId = unique;
    });
})

describe("handler getOne()", () => {
    // INVALID TEST CASES
    it("should return 404 error with appropriate message for non-match", (done) => {
        server.get('/pet/'+ uniqueId)
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.text, `Could not fetch the pet: No pet with id ${uniqueId}\n`);
                return done();
            });
    }).timeout(20000);

    // VALID TEST CASES
    it("should return 200 response for valid input (Test 1)", (done) => {
        server.get('/pet/'+ createdId1)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body._id, createdId1)
                assert.equal(res.body.name, correctJson1_name)
                assert.equal(res.body.species, correctJson1_species)
                assert.equal(res.body.age, correctJson1_age)
                assert.equal(res.body.status, correctJson1_status)
                return done();
            });
    }).timeout(20000);

    it("should return 200 response for valid input (Test 2)", (done) => {
        server.get('/pet/'+ createdId2)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body._id, createdId2)
                assert.equal(res.body.name, correctJson2_name)
                assert.equal(res.body.species, correctJson2_species)
                assert.equal(res.body.age, correctJson2_age)
                assert.equal(res.body.status, correctJson2_status)
                return done();
            });
    }).timeout(20000);

    it("should return 200 response for valid input (Test 3)", (done) => {
        server.get('/pet/'+ createdId3)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body._id, createdId3)
                assert.equal(res.body.name, correctJson3_name)
                assert.equal(res.body.species, correctJson3_species)
                assert.equal(res.body.age, correctJson3_age)
                assert.equal(res.body.status, correctJson3_status)
                return done();
            });
    }).timeout(20000);
})

describe("handler getAll() (with populated db)", () => {
    let expected, expectedJson1, expectedJson2, expectedJson3;
    
    before(() => {
        expectedJson1 = { _id: createdId1, name: correctJson1_name, species: correctJson1_species, age: correctJson1_age, status: correctJson1_status, __v: 0};
        expectedJson2 = { _id: createdId2, name: correctJson2_name, species: correctJson2_species, age: correctJson2_age, status: correctJson2_status, __v: 0};
        expectedJson3 = { _id: createdId3, name: correctJson3_name, species: correctJson3_species, age: correctJson3_age, status: correctJson3_status, __v: 0};
        expected = [expectedJson1, expectedJson2, expectedJson3];
    });

    it("should return an array with all documents within db", (done) => {
        server.get('/pet')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.text, JSON.stringify(expected));
                return done();
            });
    }).timeout(20000);
})

describe("handler update()", () => {
    // INVALID TEST CASES
	it("should return 400 error with appropriate message for empty request body", (done) => {
        server.put('/pet/' + createdId1)
            .type("json")
            .send(null)
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.text, "Could not update the pet: Request body empty.\n");
                return done();
            });
    }).timeout(20000);

    it("should return 400 error with appropriate message for missing schema fields", (done) => {
        server.put('/pet/' + createdId1)
            .type("json")
            .send(wrongJson_missingField)
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.text, "Could not update the pet: Missing required fields.\n");
                return done();
            });
    }).timeout(20000);

    it("should return 400 error with appropriate message for wrong schema type", (done) => {
        server.put('/pet/' + createdId1)
            .type("json")
            .send(wrongJson_wrongType)
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.text, "Could not update the pet: Fields are of the wrong type, please check schema.\n");
                return done();
            });
    }).timeout(20000);

    it("should return 404 error with appropriate message for non-match", (done) => {
        server.put('/pet/'+ uniqueId)
            .type("json")
            .send(correctedJson1)
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.text, `Could not update the pet: No pet with id ${uniqueId}\n`);
                return done();
            });
    }).timeout(20000);

    // VALID TEST CASES
    it("should return 200 response with pet ID for valid input (Test 1)", (done) => {
        server.put('/pet/' + createdId1)
            .type("json")
            .send(correctedJson1)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.text, `Successfully updated pet with id ${createdId1}.\n`);
                return done();
            });
    }).timeout(20000);

    it("should successfully change the document fields accordingly (Test 1)", (done) => {
        server.get('/pet/' + createdId1)
            .end((err, res) => {
                if (err) return done(err);
                delete res.body['_id']
                delete res.body['__v']
                assert.equal(JSON.stringify(res.body), JSON.stringify(correctedJson1));
                return done();
            });
    }).timeout(20000);

    it("should return 200 response with pet ID for valid input (Test 2)", (done) => {
        server.put('/pet/' + createdId2)
            .type("json")
            .send(correctedJson2)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.text, `Successfully updated pet with id ${createdId2}.\n`);
                return done();
            });
    }).timeout(20000);

    it("should successfully change the document fields accordingly (Test 2)", (done) => {
        server.get('/pet/' + createdId2)
            .end((err, res) => {
                if (err) return done(err);
                delete res.body['_id']
                delete res.body['__v']
                assert.equal(JSON.stringify(res.body), JSON.stringify(correctedJson2));
                return done();
            });
    }).timeout(20000);

    it("should return 200 response with pet ID for valid input (Test 3)", (done) => {
        server.put('/pet/' + createdId3)
            .type("json")
            .send(correctedJson3)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.text, `Successfully updated pet with id ${createdId3}.\n`);
                return done();
            });
    }).timeout(20000);

    it("should successfully change the document fields accordingly (Test 3)", (done) => {
        server.get('/pet/' + createdId3)
            .end((err, res) => {
                if (err) return done(err);
                delete res.body['_id']
                delete res.body['__v']
                assert.equal(JSON.stringify(res.body), JSON.stringify(correctedJson3));
                return done();
            });
    }).timeout(20000);
})

describe("handler delete()", () => {
    // INVALID TEST CASES
    it("should return 404 error with appropriate message for non-match", (done) => {
        server.delete('/pet/' + uniqueId)
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.text, `Could not delete the pet: No pet with id ${uniqueId}\n`);
                return done();
            });
    }).timeout(20000);

    // VALID TEST CASES
    it("should return 200 response for valid input (Test 1)", (done) => {
        server.delete('/pet/' + createdId1)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.text, `Successfully deleted the pet with id ${createdId1}.\n`)
                return done();
            });
    }).timeout(20000);

    it("should return 200 response for valid input (Test 2)", (done) => {
        server.delete('/pet/' + createdId2)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.text, `Successfully deleted the pet with id ${createdId2}.\n`)
                return done();
            });
    }).timeout(20000);

    it("should return 200 response for valid input (Test 3)", (done) => {
        server.delete('/pet/' + createdId3)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.text, `Successfully deleted the pet with id ${createdId3}.\n`)
                return done();
            });
    }).timeout(20000);
})

describe("handler getAll() (with empty db)", () => {
    it("should return an empty array", (done) => {
        server.get('/pet')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.text, "[]");
                return done();
            });
    }).timeout(20000);
})