const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Variables to hold Pokemon List
let allPokemons = []; // All Pokemon fetched from the API
let loadedPokemon = []; // Pokemon currently loaded in the view (to identify current length)
let filteredPokemons = []; // Pokemon currently filtered by search query or sorted by option

// Variables to hold sort option and search query
let sortBy = ''; 
let searchQuery = '';

// Middleware
app.set('view engine', 'ejs'); // Set the view engine to EJS
app.use(express.static('public')); // Serve static files from the 'public' directory

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

    // Render the index view and pass the loaded Pokemon
    res.render('index', { loadedPokemon: loadedPokemon, sortBy, searchQuery });
});

// Define a route for loading more Pokemon
app.get('/load-more', (req, res) => {
    const currentLength = loadedPokemon.length; // Identify the current length of loaded Pokemon
    const newLength = currentLength + 10; // Calculate the new length of loaded Pokemon
    const nextPokemons = filteredPokemons.slice(currentLength, newLength); // Get the next 10 Pokemon
    
    // Append next 10 so the length is updated when load more is clicked again
    loadedPokemon = [...loadedPokemon, ...nextPokemons]; 
    
    // Send next 10 Pokemon as JSON
    console.log('Sending Next Pokemon: ', nextPokemons);
    res.json(nextPokemons); 
});

// Sorting
app.get('/sort', (req, res) => {
    sortBy = req.query.sortBy; // Get the sort option from the query string
    
    if (sortBy === 'id') {
        filteredPokemons.sort((a, b) => a.id - b.id);
    } else if (sortBy === 'name') {
        filteredPokemons.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    // Load the first 10 Pokemon from the sorted list
    loadedPokemon = filteredPokemons.slice(0, 10);
    res.render('index', { loadedPokemon: loadedPokemon, sortBy, searchQuery });
});

app.get('/search', (req, res) => {
    searchQuery = req.query.searchQuery.toLowerCase(); // Get the search query from the query string
    
    // Filter Pokemon by search query
    filteredPokemons = allPokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchQuery) || pokemon.id.toString() === searchQuery
    );
    
    if (sortBy === 'id') {
        filteredPokemons.sort((a, b) => a.id - b.id);
    } else if (sortBy === 'name') {
        filteredPokemons.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    // Load the first 10 Pokemon from the filtered list
    loadedPokemon = filteredPokemons.slice(0, 10);

    // Render the index view and pass the loaded Pokemon
    console.log('Sending Pokemon Search Results: ', loadedPokemon);
    res.render('index', { loadedPokemon: loadedPokemon, sortBy, searchQuery, searchQuery });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});