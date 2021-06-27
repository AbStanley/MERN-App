const mongoose = require("../db");
const validPokemonTypes = require('../static_data/validPokemonTypes')

const definition = {
    _id:        { type: Number, required: true, min: 0 },
    name:       { type: String, required: true },
    height:     { type: Number, min: 0 },
    weight:     { type: Number, min: 0 },
    type:       { type: [String], enum: validPokemonTypes },
    weakness:   { type: [String], enum: validPokemonTypes },
    avatarPath: { type: String }
};

const options = {
    toJSON: {
        transform: (doc, obj, options) => {
            obj.id = obj._id;
            delete obj._id;
            delete obj.__v;
            return obj;
        }
    }
};

const pokemonSchema = new mongoose.Schema(definition, options);

const Pokemon = mongoose.model('Pokemon', pokemonSchema, 'pokemon');

module.exports = Pokemon;
