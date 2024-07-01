const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Variables to hold Pokemon List
let allPokemons = [];
let loadedPokemon = [];

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Function for fetching all Pokemon
const fetchAllPokemon = async () => {
    try {
        // Fetch all Pokemon from the PokeAPI
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
        
        // Extract the name and ID of each Pokemon
        allPokemons = response.data.results.map((pokemon) => {
            const id = pokemon.url.match(/\/pokemon\/(\d+)\//)[1]; // Extract ID from URL
            return {
                name: pokemon.name,
                id: parseInt(id, 10), // Convert ID to number
            };
        });;

        console.log('All Pokemon fetched: ', allPokemons);        
    } catch (error) {
        console.error('Error fetching all Pokemon: ', error);
    }
};

// Fetch all Pokemon on server start
fetchAllPokemon();

// Define a route for the root URL
app.get('/', (req, res) => {
    loadedPokemon = allPokemons.slice(0, 10); // Load first 10 Pokemon 
    console.log('Sending Loaded Pokemon: ', loadedPokemon);
    res.render('index', { loadedPokemon: loadedPokemon });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});