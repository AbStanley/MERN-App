/* 
This module contains all the functions for making fetch calls to the 
Pokemon web API. Each function returns the fetch response object.
*/
const api = {
    baseURL: 'http://localhost:8000/api/pokemon',

    login: async function(userInfo) {
        const token = sessionStorage.getItem('token');
        const url = this.baseURL + '/login';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth': token
            },
            body: JSON.stringify(userInfo)
        });
        return response;
    },

    getAllPokemon: async function() {
        const token = sessionStorage.getItem('token');
        const url = this.baseURL;
        const init = { 
            method: 'GET',
            headers: {
                'X-Auth': token
            },
        };

        const response = await fetch(url, init);
        return response;
    },


    getPokemonById: async function(id) {
        const token = sessionStorage.getItem('token');
        const url = `${this.baseURL}/${id}`;
        const init = { 
            method: 'GET',
            headers: {
                'X-Auth': token
            },
        };

        const response = await fetch(url, init);
        return response;
    },


    getPokemonByQuery: async function(query) {
        const token = sessionStorage.getItem('token');
        const queryString = getQueryString(query);
        console.log(queryString);

        const url = `${this.baseURL}?${queryString}`;
        const init = { 
            method: 'GET',
            headers: {
                'X-Auth': token
            }
        };

        const response = await fetch(url, init);
        return response;
    },


    addNewPokemon: async function(pokemon) {
        const token = sessionStorage.getItem('token');
        const url = `${this.baseURL}`;
        const init = { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth': token,
            },
            body: JSON.stringify(pokemon)
        };

        const response = await fetch(url, init);
        return response;
    },


    updatePokemon: async function(pokemon) {
        const token = sessionStorage.getItem('token');
        const url = `${this.baseURL}/${pokemon.id}`;
        const init = { 
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth': token,
            },
            body: JSON.stringify(pokemon)
        };

        const response = await fetch(url, init);
        return response;
    },


    deletePokemon: async function(id) {
        const token = sessionStorage.getItem('token');
        const url = `${this.baseURL}/${id}`;
        const init = { 
            method: 'DELETE',
            headers: {
                'X-Auth': token,
            } 
        };

        const response = await fetch(url, init);
        return response;
    }
}


/* 
Helper function - turns array properties of the query object into their proper 
query string representation where each array value become a separate key/value
pair in the string.

Example:
    const query = {
        name: 'Bulbasuar',
        type: ['Grass', 'Poison']
    };

    getQueryString(query) => 'name=Bulbasaur&type=Grass&type=Poison'
*/
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


export default api;
