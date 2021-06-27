// Initializes the database with some data

const Pokemon = require('./models/pokemon');
const User = require('./models/user');
const bcrypt = require('bcryptjs');
const initPokemon = require('./static_data/initPokemon');

initDatabase();

async function initDatabase() {
    console.log('Initializing database...');

    // Clear pokemon collection
    await Pokemon.deleteMany({});

    // Insert initial data
    for (const p of initPokemon) {
        const pokemon = new Pokemon(p);
        pokemon.avatarPath = `initAvatars/${p._id}.png`;
        await pokemon.save();
    }

    // Insert user bsmith
    const username = 'bsmith';
    const password = bcrypt.hashSync('opensesame');
    const user = new User({username, password});
    await user.save();

    console.log('Database initialized.');
    process.exit();
}
