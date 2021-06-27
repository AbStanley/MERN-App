# Pokémon API
*COMP 4310 Project 2 - RESTful Web API*  
*By Anthony Hackworth and Addison Yates*

## Description
This project implements a RESTful Web API using MongoDB and Express with Node.js. The API is used to access data about Pokémon characters.

## Contributions
* **Anthony _(40%)_**
	* Mocha/Chai test suite
	* Web page
* **Addison _(60%)_**
	* Express app and MongoDB setup
	* API Middleware

---

## Data Stored
**Data source:** [Pokédex](https://www.pokemon.com/us/pokedex/)
| Field			| Data Type 	| Required	 | Description											|
| ------------- | :-----------: | :--------: | ---------------------------------------------------- |
| **id**		| Number		| Yes		 | National Pokédex number								|
| **name**		| String		| Yes		 | The Pokémon's name									|
| **height**	| Number		| No		 | The Pokémon's height in inches						|
| **weight**	| Number		| No		 | The Pokémon's weight	in pounds						|
| **type**		| [String]		| No		 | The Pokémon's type(s)								|
| **weakness** 	| [String]		| No		 | The Pokémon's type weakness(es)						|

### Valid Type/Weakness Values
The fields **type** and **weakness** should only contain elements that are valid String representations of valid types. There are [18 valid types](https://pokemon.fandom.com/wiki/Types), each of which begins with a capital letter. For convenience, an API endpoint is provided that returns a JSON String array of all valid types.

---

## Endpoints
**Base URL:** http://localhost:8000/api

### Overview
| Relative URL  	| Request Type  | Description 							|
| ----------------- |:-------------:| ------------------------------------- |
| /pokemon      	| GET		    | Get all Pokémon 						|
| /pokemon/*id* 	| GET	        | Get Pokémon by id 					|
| /pokemon?*query*  | GET	        | Get all Pokémon that match query 		|
| /pokemon/types 	| GET	        | Get a list of all valid Pokémon types |
| /pokemon		 	| POST	        | Create Pokémon using JSON body		|
| /pokemon/*id* 	| PUT	        | Update Pokémon by id using JSON body	|
| /pokemon/*id* 	| DELETE	    | Delete Pokémon by id					|

### Valid query string parameters:
* **name** - e.g. `/api/pokemon?name=Bulbasaur`
* **height** - e.g. `/api/pokemon?height=12`
* **weight** - e.g. `/api/pokemon?weight=100`
* **type** - e.g. `/api/pokemon?type=Grass`
* **weakness** - e.g. `/api/pokemon?weakness=Fire`

Multiple values may be sent for a query string parameter to create an array of values. Any Pokémon that matches **at least one** value in the array will be returned. For example, `/api/pokemon?type=Grass&type=Bug` returns any Pokémon whose type includes Grass **or** Bug.  

When multiple different query string parameters are sent together, a Pokémon must satisfy **all** the query parameters in order to be returned. For example, `/api/pokemon?type=Grass&type=Bug&weakness=Fire` returns any Pokémon whose type includes Grass or Bug **and** weakness includes Fire.

## Query Responses

Query responses will always be JSON objects. A successful query will return an array of Pokémon documents. An unsuccessful query will return a JSON object with information regarding the failure.

### Example 1:
```HTTP
GET /api/pokemon?name=Bulbasaur
```
**Response:**
```HTTP 
200 OK
```
```JSON
[
    {
        "type": [
            "Grass",
            "Poison"
        ],
        "weakness": [
            "Fire",
            "Psychic",
            "Flying",
            "Ice"
        ],
        "name": "Bulbasaur",
        "height": 28,
        "weight": 15.2,
        "id": 1
    }
]
```
### Example 2:
```HTTP
GET /api/pokemon?type=Grass&type=Bug&weakness=Electric
```
**Response:**
```HTTP 
200 OK
```
```JSON
[
    {
        "type": [
            "Bug",
            "Flying"
        ],
        "weakness": [
            "Fire",
            "Flying",
            "Electric",
            "Ice",
            "Rock"
        ],
        "name": "Butterfree",
        "height": 43,
        "weight": 70.5,
        "id": 12
    }
]
```
### Example 3:
```HTTP
GET /api/pokemon?name=FrankMcCown
```
**Response:**
```HTTP 
404 Not Found
```
```JSON
{
    "message": "No Pokémon found",
    "query": {
        "name": [
            "FrankMcCown"
        ]
    }
}
```
### Example 4:
```HTTP
GET /api/pokemon?haircolor=brown
```
**Response:**
```HTTP 
400 Bad Request
```
```JSON
{
    "message": "Invalid query field(s)",
    "query": {
        "haircolor": [
            "brown"
        ]
    },
    "invalidFields": [
        "haircolor"
    ]
}
```

---

## Internal Structure
* **lib/** - contains all source code
	* **app/** - code for the Express application
		* **api/** - code for APIs
		* *index.js* - creates Express app and mounts features/registers middleware
	* **models/** - Mongoose schemas and models
	* **static_data/** - any non-changing, non-DB data needed
	* *config.js* - configuration data
	* *db.js* - creates MongoDB connection via Mongoose
	* *init.js* - clears DB and initializes it with small data set
	* *server.js* - entry point; starts server
* **static/** - contains static files *(used as root directory for express.static())*
* **test/** - contains code for Mocha/Chai test suite

### NPM Scripts
* *init* - runs init.js to initialize DB
* *start* - runs server.js
* *start:watch* - runs server.js in watch mode (requires Nodemon)
* *test* - runs Mocha/Chai test suite
