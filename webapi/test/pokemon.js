const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../lib/app');
const Pokemon = require('../lib/models/pokemon');

// An array of sample pokemon objects
const testPokemon = require('../lib/static_data/initPokemon');

// Use should BDD-style syntax
const should = chai.should();   

// Use Chai HTTP
chai.use(chaiHttp);


/* TODO: Add tests here */
describe('Pokemon API', () => {

    beforeEach(async() =>{
        await Pokemon.deleteMany({});

        testPokemonData.length = 0;

        for(const pocket of testPokemon){
            const pokemon = new Pokemon(pocket);
            const pokDoc = await pokemon.save();
            testPokemonData.push(pokDoc);
        }
    })

    const testPokemonData = [];

    describe('GET /pokemon', () => {

        it('should return all pokemon in the collection', (done) => {
            chai.request(server)
                .get('/api/pokemon/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(12);
                    done();
                });
        });

        it('should find no pokemon when collection is empty', (done) => {
            Pokemon.deleteMany({}, {}, () => {
                chai.request(server)
                    .get('/api/pokemon/')
                    .end((err, res) => {
                        res.should.have.status(404);
                        done();
                    });
            });

        });
    });

    describe('GET /pokemon?query', () => {
        
        it('should find pokemon by name query', (done) =>{
            chai.request(server)
                .get('/api/pokemon?name=Bulbasaur')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    for (const pokemon of res.body) {
                        pokemon.name.should.be.eql('Bulbasaur');
                    }
                    done();
                });
        });

        it('should find pokemon by type query', (done) =>{
            chai.request(server)
                .get('/api/pokemon?type=Fire')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    for (const pokemon of res.body) {
                        pokemon.type.should.include('Fire');
                    }
                    done();
                });
        });

        it('should find pokemon by weakness query', (done) =>{
            chai.request(server)
                .get('/api/pokemon?weakness=Fire')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    for (const pokemon of res.body) {
                        pokemon.weakness.should.include('Fire');
                    }
                    done();
                });
        });

        it('should find pokemon by height query', (done) =>{
            chai.request(server)
                .get('/api/pokemon?height=12')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    for (const pokemon of res.body) {
                        pokemon.height.should.be.eql(12);
                    }
                    done();
                });
        });

        it('should find pokemon by weight query', (done) =>{
            chai.request(server)
                .get('/api/pokemon?weight=18.7')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    for (const pokemon of res.body) {
                        pokemon.weight.should.be.eql(18.7);
                    }
                    done();
                });
        });

        it('should find no pokemon when none match query', (done) =>{
            chai.request(server)
                .get('/api/pokemon?weight=100000')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });

        it('should get a bad request error with invalid query parameters', (done) =>{
            chai.request(server)
                .get('/api/pokemon?coolness=100')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('invalidFields');
                    res.body.invalidFields.should.include('coolness');
                    done();
                });
        });
    });

    describe('GET /:id pokemon', () =>{
        it('should get a pokemon by their id', (done) => {
            const pokemon = testPokemonData[0];
            chai.request(server)
                .get('/api/pokemon/' + pokemon._id)
                .end((err, res) =>{
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name').eql(pokemon.name);
                    res.body.should.have.property('height').eql(pokemon.height);
                    res.body.should.have.property('weight').eql(pokemon.weight);
                    res.body.should.have.property('type').eql(pokemon.type);
                    res.body.should.have.property('weakness').eql(pokemon.weakness);         
                    done();      
                });
        });

        it('should find no pokemon when none match id', (done) =>{
            const badEgg = {name: 'Missingno', _id: 999};

            chai.request(server)
                .get('/api/pokemon/' + badEgg._id)
                .end((err, res) =>{
                    res.should.have.status(404);
                    done();
                });
        });

        it('Should get an error when id is invalid type', (done) =>{
            const badEgg = {name: 'Missingno', _id: 'nineninenine'};

            chai.request(server)
                .get('/api/pokemon/' + badEgg._id)
                .end((err, res) =>{
                    res.should.have.status(400);
                    done();
                });
        });
    });

    describe('POST /pokemon', () =>{
        it('should add a valid pokemon successfully', (done) =>{
            const newPokemon = {
                "id": 13,
                "name": "Weedle",
                "height": 12,
                "weight": 7.1,
                "type": [
                    "Bug",
                    "Poison"
                ],
                "weakness": [
                    "Fire",
                    "Psychic",
                    "Flying",
                    "Rock"
                ]
            };

            chai.request(server)
                .post('/api/pokemon/')
                .send(newPokemon)
                .end((err, res) =>{
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.should.have.property('height');
                    res.body.should.have.property('weight');
                    res.body.should.have.property('type');
                    res.body.should.have.property('weakness');
                    done();
                });
        });

        it('should not add a pokemon without a name', (done) =>{
            const badEgg = {_id: 000};

            chai.request(server)
                .post('/api/pokemon/')
                .send(badEgg)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('invalidFields');
                    res.body.invalidFields.should.include('name');
                    done();
                });
        });

        it('should not add a pokemon with a negative height or weight', (done) =>{
            const newPokemon = {
                "id": 13,
                "name": "Weedle",
                "height": -12,
                "weight": -7.1,
                "type": [
                    "Bug",
                    "Poison"
                ],
                "weakness": [
                    "Fire",
                    "Psychic",
                    "Flying",
                    "Rock"
                ]
            };

            chai.request(server)
                .post('/api/pokemon/')
                .send(newPokemon)
                .end((err, res) =>{
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('invalidFields');
                    res.body.invalidFields.should.include('height');
                    res.body.invalidFields.should.include('weight');
                    done();
                });
        });
        
        it('should not add a pokemon with an invalid type or weakness value', (done) =>{
            const newPokemon = {
                "id": 13,
                "name": "Weedle",
                "height": 12,
                "weight": 7.1,
                "type": [
                    "Bug",
                    "Boisonberry"
                ],
                "weakness": [
                    "FireballsFromHeaven",
                    "Psychic",
                    "Flying",
                    "Rock"
                ]
            };

            chai.request(server)
                .post('/api/pokemon/')
                .send(newPokemon)
                .end((err, res) =>{
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('invalidFields');
                    res.body.invalidFields.should.include('type');
                    res.body.invalidFields.should.include('weakness');
                    done();
                });
        });

        it('should not add invalid fields', (done) =>{
            const newPokemon = {
                "coolness": 100,
                "id": 13,
                "name": "Weedle",
                "height": 12,
                "weight": 7.1,
                "type": [
                    "Bug",
                    "Poison"
                ],
                "weakness": [
                    "Fire",
                    "Psychic",
                    "Flying",
                    "Rock"
                ]
            };

            chai.request(server)
                .post('/api/pokemon/')
                .send(newPokemon)
                .end((err, res) =>{
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.should.have.property('height');
                    res.body.should.have.property('weight');
                    res.body.should.have.property('type');
                    res.body.should.have.property('weakness');
                    res.body.should.not.have.property('coolness');
                    done();
                });
        });

        it('should not post a pokemon without an id', (done) =>{
            const badEgg = {name: 'Missingno'};

            chai.request(server)
            .post('/api/pokemon/')
            .send(badEgg)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
        });

        it('should not post a pokemon with a pre-existing id', (done) =>{
            const badEgg = {name: 'Missingno', id: 1};

            chai.request(server)
            .post('/api/pokemon/')
            .send(badEgg)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
        });

    });

    describe('PUT /pokemon/:id', () =>{
        it('should update a valid pokemon', (done) => {
            const pokemon = testPokemonData[0];
            pokemon.name = 'Missingno';
            pokemon.height = '50';
            pokemon.weight = '3';
            pokemon.type = 'Normal';
            pokemon.weakness = 'Ghost';

            chai.request(server)
                .put('/api/pokemon/' +  testPokemonData[0]._id)
                .send(pokemon)
                .end((err, res) =>{
                    res.should.have.status(204);

                    chai.request(server)
                        .get('/api/pokemon/' + testPokemonData[0]._id)
                        .end((err, res) => {
                            res.should.have.status(200);
						    res.body.should.be.a('object');
						    res.body.should.have.property('name').eql(pokemon.name);
						    res.body.should.have.property('height').eql(pokemon.height);
						    res.body.should.have.property('weight').eql(pokemon.weight);
						    res.body.should.have.property('type').eql(pokemon.type);
						    res.body.should.have.property('weakness').eql(pokemon.weakness);
						    done();
                        });
                });
        });

        it('should fail with id that doesn\'t already exist', (done) =>{
            const pokemon = testPokemonData[0];
            pokemon.name = 'newname';

            chai.request(server)
                .put('/api/pokemon/999')
                .send(pokemon)
                .end((err, res) =>{
                    res.should.have.status(404);
                    done();
                });
        });

        it('should not update a pokemon with invalid data', (done) =>{
            const badEgg = testPokemonData[0];
            badEgg.height = -10;

            chai.request(server)
                .put('/api/pokemon/' + badEgg._id)
                .send(badEgg)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('invalidFields');
                    res.body.invalidFields.should.include('height');

                    
                    chai.request(server)
                    .get('/api/pokemon/' + badEgg._id)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('height').eql(testPokemon[0].height);
                        done();
                    });
                });
        });
    });

    describe('DELETE /pokemon/:id', () =>{
        it('should delete an existing pokemon by id', (done) =>{
            const pokemon = testPokemonData[0];

            chai.request(server)
                .delete('/api/pokemon/' + pokemon._id)
                .end((err, res) =>{
                    res.should.have.status(204);

                    chai.request(server)
                        .get('/api/pokemon/' + pokemon._id)
                        .end((err, res) => {
                            res.should.have.status(404);
                            done();
                        });
                });
        });

        it('should fail with id that doesn\'t already exist', (done) =>{
          badEgg = testPokemonData[0];
          badEgg._id = 999;
          
          chai.request(server)
                .delete('/api/pokemon/' + badEgg._id)
                .end((err, res) =>{
                    res.should.have.status(404);
                    done();
                });
        });
    });
});
