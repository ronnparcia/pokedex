const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Variables to hold Pokemon List
let allPokemons = [];
let loadedPokemon = [];
let filteredPokemons = [];

let sortBy = '';
let searchQuery = '';

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
        
        // Initially, all Pokemon are in the filtered list
        filteredPokemons = allPokemons;
        
        console.log('All Pokemon fetched: ', allPokemons);        
    } catch (error) {
        console.error('Error fetching all Pokemon: ', error);
    }
};

// Fetch all Pokemon on server start
fetchAllPokemon();

// Define a route for the root URL
app.get('/', (req, res) => {
    // Reset search query and sort option to default values
    sortBy = ''; // Default sort option
    searchQuery = ''; // Default search query

    // Reset filteredPokemons to allPokemons
    filteredPokemons = allPokemons;

    // Load first 10 Pokemon from the full list
    loadedPokemon = allPokemons.slice(0, 10);


    console.log('Sending Loaded Pokemon: ', loadedPokemon);
    res.render('index', { loadedPokemon: loadedPokemon, sortBy, searchQuery });
});

// Define a route for loading more Pokemon
app.get('/load-more', (req, res) => {
    const currentLength = loadedPokemon.length;
    const newLength = currentLength + 10;
    const nextPokemons = filteredPokemons.slice(currentLength, newLength);

    loadedPokemon = [...loadedPokemon, ...nextPokemons];
    
    console.log('Sending Next Pokemon: ', nextPokemons);
    res.json(nextPokemons); // Send next 10 Pokemon as JSON
});

// Sorting
app.get('/sort', (req, res) => {
    sortBy = req.query.sortBy;
    
    if (sortBy === 'id') {
        filteredPokemons.sort((a, b) => a.id - b.id);
    } else if (sortBy === 'name') {
        filteredPokemons.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    loadedPokemon = filteredPokemons.slice(0, 10);
    res.render('index', { loadedPokemon: loadedPokemon, sortBy, searchQuery });
});

app.get('/search', (req, res) => {
    searchQuery = req.query.searchQuery.toLowerCase();

    filteredPokemons = allPokemons.filter(pokemon =>
        pokemon.name.toLowerCase().startsWith(searchQuery.toLowerCase()) || pokemon.id.toString() === searchQuery
    );

    if (sortBy === 'id') {
        filteredPokemons.sort((a, b) => a.id - b.id);
      } else if (sortBy === 'name') {
        filteredPokemons.sort((a, b) => a.name.localeCompare(b.name));
      }
    
      loadedPokemon = filteredPokemons.slice(0, 10);
      res.render('index', { loadedPokemon: loadedPokemon, sortBy, searchQuery, searchQuery });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});