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
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
        allPokemons = response.data.results;
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