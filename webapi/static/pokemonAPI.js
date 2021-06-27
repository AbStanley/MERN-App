const pokemonAPI = {
    baseURL: '/api/pokemon',

    getAllPokemon: async function() {
        const url = this.baseURL;
        const init = { method: 'GET' };

        const response = await fetch(url, init);
        const ok = response.ok;
        const status = response.status;
        const results = await response.json();
        return { ok, status, results };
    },

    getPokemonById: async function(id) {
        const url = `${this.baseURL}/${id}`;
        const init = { method: 'GET' };

        const response = await fetch(url, init);
        const ok = response.ok;
        const status = response.status;
        const results = await response.json();
        return { ok, status, results };
    },

    getPokemonByQuery: async function(query) {
        const queryString = getQueryString(query);
        console.log(queryString);

        const url = `${this.baseURL}?${queryString}`;
        const init = { method: 'GET' };

        const response = await fetch(url, init);
        const ok = response.ok;
        const status = response.status;
        const results = await response.json();
        return { ok, status, results };
    },

    addNewPokemon: async function(pokemon) {
        const url = `${this.baseURL}`;
        const init = { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pokemon)
        };

        const response = await fetch(url, init);
        const ok = response.ok;
        const status = response.status;
        const results = await response.json();
        return { ok, status, results };
    },

    updatePokemon: async function(pokemon) {
        const url = `${this.baseURL}/${pokemon.id}`;
        const init = { 
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pokemon)
        };

        const response = await fetch(url, init);
        const ok = response.ok;
        const status = response.status;
        let results;
        if (status != 204) results = await response.json();
        return { ok, status, results };
    },

    deletePokemon: async function(id) {
        const url = `${this.baseURL}/${id}`;
        const init = { method: 'DELETE' };

        const response = await fetch(url, init);
        const ok = response.ok;
        const status = response.status;
        let results;
        if (status != 204) results = await response.json();
        return { ok, status, results };
    }
}

function getQueryString(query) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
        if (Array.isArray(value)) {
            for (const v of value) {
                params.append(key, v);
            }
        }
        else {
            params.append(key, value);
        }
    }
    return params.toString();
}
