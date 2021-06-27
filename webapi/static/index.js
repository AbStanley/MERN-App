
const resultsDiv = document.getElementById('resultsDiv');

const getAllForm = document.getElementById('getAllForm');
getAllForm.addEventListener('submit', cancelFormSubmission);
getAllForm.addEventListener('submit', getAll);

const getByIdForm = document.getElementById('getByIdForm');
getByIdForm.addEventListener('submit', cancelFormSubmission);
getByIdForm.addEventListener('submit', getById);

const getByQueryForm = document.getElementById('getByQueryForm');
getByQueryForm.addEventListener('submit', cancelFormSubmission);
getByQueryForm.addEventListener('submit', getByQuery);

const addNewPokemonForm = document.getElementById('addNewPokemonForm');
addNewPokemonForm.addEventListener('submit', cancelFormSubmission);
addNewPokemonForm.addEventListener('submit', addNewPokemon);

const updatePokemonForm = document.getElementById('updatePokemonForm');
updatePokemonForm.addEventListener('submit', cancelFormSubmission);
updatePokemonForm.addEventListener('submit', updatePokemon);

const deleteForm = document.getElementById('deleteForm');
deleteForm.addEventListener('submit', cancelFormSubmission);
deleteForm.addEventListener('submit', deletePokemon);


function cancelFormSubmission(event) {
    event.preventDefault();
}

function validId(id) {
    return Number.isInteger(id) && id > 0;
}

function stringFromTypeArray(arr) {
    let s = "";
    let first = true;

    for (const t of arr) {
        first ? first = false : s += ', ';
        s += `<span class='${t}Type'>${t}</span>`;
    }

    return s;
}

function getCheckboxesValue(selector) {
    const checkedCheckboxes = document.querySelectorAll(selector);
    
    if (checkedCheckboxes.length > 0) {
        const values = [];
    
        for (const checkbox of checkedCheckboxes) {
            values.push(checkbox.name);
        }
    
        return values;
    }
}

function getQueryTypeCheckboxesValue() {
    const selector = '#queryTypeCheckboxes input[type="checkbox"]:checked';
    return getCheckboxesValue(selector);
}

function getQueryWeaknessCheckboxesValue() {
    const selector = '#queryWeaknessCheckboxes input[type="checkbox"]:checked';
    return getCheckboxesValue(selector);
}

function getAddTypeCheckboxesValue() {
    const selector = '#addTypeCheckboxes input[type="checkbox"]:checked';
    return getCheckboxesValue(selector);
}

function getAddWeaknessCheckboxesValue() {
    const selector = '#addWeaknessCheckboxes input[type="checkbox"]:checked';
    return getCheckboxesValue(selector);
}

function getUpdateTypeCheckboxesValue() {
    const selector = '#updateTypeCheckboxes input[type="checkbox"]:checked';
    return getCheckboxesValue(selector);
}

function getUpdateWeaknessCheckboxesValue() {
    const selector = '#updateWeaknessCheckboxes input[type="checkbox"]:checked';
    return getCheckboxesValue(selector);
}

// Returns html to represent an array of pokemon documents
function showResults(pokemon) {
    let html = `
    <table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Height</th>
            <th>Weight</th>
            <th>Type</th>
            <th>Weakness</th>
        </tr>
    </thead>
    <tbody>
    `;

    for (const p of pokemon) {
        if (p.height === undefined) p.height = '';
        if (p.weight === undefined) p.weight = '';

        html += '<tr>';
        html += `<td>${p.id}</td>`
        html += `<td>${p.name}</td>`
        html += `<td>${p.height}</td>`
        html += `<td>${p.weight}</td>`
        html += `<td>${stringFromTypeArray(p.type)}</td>`
        html += `<td>${stringFromTypeArray(p.weakness)}</td>`
        html += '</tr>';
    }

    html += `
    </tbody>
    </table>
    `;

    resultsDiv.innerHTML = html;
}

async function getAll() {
    const response = await pokemonAPI.getAllPokemon();
    if (response.ok) {
        showResults(response.results);
    }
    else {
        // Handle bad input
    }
}

async function getById() {
    const id = Number.parseInt(document.getElementById('idToGet').value);
    if (validId(id)) {
        const response = await pokemonAPI.getPokemonById(id);
        if (response.ok) {
            showResults([response.results]);
        }
    }
    else {
        // Handle bad input
    }
}

async function getByQuery() {
    const name = document.getElementById('nameToGet').value.trim();
    const height = Number.parseFloat(document.getElementById('heightToGet').value);
    const weight = Number.parseFloat(document.getElementById('weightToGet').value);
    const type = getQueryTypeCheckboxesValue();
    const weakness = getQueryWeaknessCheckboxesValue();

    let query = { name, height, weight, type, weakness };
    for (let prop in query) {
        if (!query[prop]) delete query[prop];
    }

    const response = await pokemonAPI.getPokemonByQuery(query);
    if (response.ok) {
        showResults(response.results);
    }
    else if (response.status == 404) {
        showResults([]);
    }
    else {
        alert(response.results.message);
    }
}

async function addNewPokemon() {
    const id = Number.parseInt(document.getElementById('idToAdd').value);
    const name = document.getElementById('nameToAdd').value.trim();
    const height = Number.parseFloat(document.getElementById('heightToAdd').value);
    const weight = Number.parseFloat(document.getElementById('weightToAdd').value);
    const type = getAddTypeCheckboxesValue();
    const weakness = getAddWeaknessCheckboxesValue();

    const pokemon = { id, name, height, weight, type, weakness };
    for (let prop in pokemon) {
        if (!pokemon[prop]) delete pokemon[prop];
    }

    const response = await pokemonAPI.addNewPokemon(pokemon);
    if (response.ok) {
        alert(`${name} added successfully.`);
        getAll();
    }
    else {
        alert(response.results.message);
    }
}

async function updatePokemon() {
    const id = Number.parseInt(document.getElementById('idToUpdate').value);
    const name = document.getElementById('nameToUpdate').value.trim();
    const height = Number.parseFloat(document.getElementById('heightToUpdate').value);
    const weight = Number.parseFloat(document.getElementById('weightToUpdate').value);
    const type = getUpdateTypeCheckboxesValue();
    const weakness = getUpdateWeaknessCheckboxesValue();

    const pokemon = { id, name, height, weight, type, weakness };
    for (let prop in pokemon) {
        if (!pokemon[prop]) delete pokemon[prop];
    }

    const response = await pokemonAPI.updatePokemon(pokemon);
    if (response.ok) {
        alert(`Pokémon #${id} updated successfully.`);
        getAll();
    }
    else {
        alert(response.results.message);
    }
}

async function deletePokemon() {
    const id = Number.parseInt(document.getElementById('idToDelete').value);
    if (id) {
        const response = await pokemonAPI.deletePokemon(id);
        if (response.ok) {
            alert(`Pokémon #${id} deleted successfully.`);
            getAll();
        }
        else {
            alert(response.results.message);
        }
    }
}

getAll();
