const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Variables to hold Pokemon List
let allPokemons = []; // All Pokemon fetched from the API
let allPokemonsFilteredSorted = []; // Pokemon currently filtered by search query or sorted by option
let loadedPokemons = []; // Pokemon currently loaded in the view (to identify current length)

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
            
            let imageUrl = null;
            if (id.length < 5) {
                imageUrl = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id.padStart(3, '0')}.png`;
            }
            
            return {
                name: pokemon.name,
                id: parseInt(id, 10), // Convert ID to number
                imageUrl: imageUrl
            };
        });;
        
        // Initially, all Pokemon are in the filtered list
        allPokemonsFilteredSorted = allPokemons;
        
        console.log('All Pokemon fetched.');        
    } catch (error) {
        console.error('Error fetching all Pokemon: ', error);
    }
};

// Function to fetch qeaknesses
const fetchWeaknesses = async (types) => {
    let weaknesses = [];
    
    for (const type of types) {
        const response = await axios.get(type.type.url);
        const data = response.data;
        
        for (const weakness of data.damage_relations.half_damage_from) {
            if (!weaknesses.includes(weakness.name)) {
                weaknesses.push(weakness.name);
            }
        }
    }
    
    return weaknesses;
};

// Fetch all Pokemon on server start
fetchAllPokemon();

// Define a route for the root URL
app.get('/', (req, res) => {
    // Reset search query and sort option to default values
    sortBy = ''; // Default sort option
    searchQuery = ''; // Default search query
    
    // Reset allPokemonsFilteredSorted to allPokemons
    allPokemonsFilteredSorted = allPokemons;
    
    // Load first 10 Pokemon from the full list
    loadedPokemons = allPokemons.slice(0, 10);
    
    console.log('Sending Loaded Pokemon.');
    
    // Render the index view and pass the loaded Pokemon
    res.render('index', { loadedPokemons: loadedPokemons, sortBy, searchQuery });
});

// Define a route for loading more Pokemon
app.get('/load-more', (req, res) => {
    const currentLength = loadedPokemons.length; // Identify the current length of loaded Pokemon
    const newLength = currentLength + 10; // Calculate the new length of loaded Pokemon
    const nextPokemons = allPokemonsFilteredSorted.slice(currentLength, newLength); // Get the next 10 Pokemon
    
    // Append next 10 so the length is updated when load more is clicked again
    loadedPokemons = [...loadedPokemons, ...nextPokemons]; 
    
    // Send next 10 Pokemon as JSON
    console.log('Sending Next Pokemon.');
    res.json(nextPokemons); 
});

// Sorting
app.get('/sort', (req, res) => {
    sortBy = req.query.sortBy; // Get the sort option from the query string
    
    if (sortBy === 'id') {
        allPokemonsFilteredSorted.sort((a, b) => a.id - b.id);
    } else if (sortBy === 'name') {
        allPokemonsFilteredSorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    // Load the first 10 Pokemon from the sorted list
    loadedPokemons = allPokemonsFilteredSorted.slice(0, 10);
    res.render('index', { loadedPokemons: loadedPokemons, sortBy, searchQuery });
});

app.get('/search', (req, res) => {
    searchQuery = req.query.searchQuery.toLowerCase(); // Get the search query from the query string
    
    // Filter Pokemon by search query
    allPokemonsFilteredSorted = allPokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchQuery) || pokemon.id.toString() === searchQuery
    );
    
    if (sortBy === 'id') {
        allPokemonsFilteredSorted.sort((a, b) => a.id - b.id);
    } else if (sortBy === 'name') {
        allPokemonsFilteredSorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    // Load the first 10 Pokemon from the filtered list
    loadedPokemons = allPokemonsFilteredSorted.slice(0, 10);
    
    // Render the index view and pass the loaded Pokemon
    console.log('Sending Pokemon Search Results.');
    res.render('index', { loadedPokemons: loadedPokemons, sortBy, searchQuery, searchQuery });
});

app.get('/pokemon/:id', async (req, res) => {
    const id = req.params.id;
    
    try {
        const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const pokemonData = await pokemonResponse.json();
        const pokemonimageUrl = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id.padStart(3, '0')}.png`;
        
        const pokemonWeaknesses = await fetchWeaknesses(pokemonData.types);
        console.log(pokemonimageUrl);
        
        res.render('detailed-view', {id, pokemon: pokemonData, pokemonWeaknesses, pokemonimageUrl});
    } catch (error) {
        console.error('Error fetching Pokemon details: ', error);
        res.status(500).send('Error fetching Pokemon details');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});