// On document ready
$(document).ready(() => {
    let pokemonData = []; // Array to store Pokemon data
    const limit = 10;
    let offset = 0;

    function updatePokemonList(pokemonData) {
        // Clear list
        $('#pokemonList').empty();
    
        // Append Pokemon names to the list
        pokemonData.forEach(pokemon => {
            // Get ID
            let pokemonID = pokemon.url.replace('https://pokeapi.co/api/v2/pokemon/', '').replace('/', '');

            $('#pokemonList').append(`<li>${pokemonID}: ${pokemon.name}</li>`);
        });
    }

    // Function to sort Pokemon data
    function sortPokemonData(pokemonData, criteria) {
        return pokemonData.sort((a, b) => {
            if (criteria === 'id') {
                let idA = a.url.replace('https://pokeapi.co/api/v2/pokemon/', '').replace('/', '');
                let idB = b.url.replace('https://pokeapi.co/api/v2/pokemon/', '').replace('/', '');
                return idA - idB;
            } else if (criteria === 'name') {
                return a.name.localeCompare(b.name);
            }
        });
    }

    function sortAndDisplay(criteria) {
        // Sort the global pokemonData array
        pokemonData = sortPokemonData(pokemonData, criteria);
        // Update the list on the page
        updatePokemonList(pokemonData);
    }

    // Function to load Pokemon
    function loadPokemon() {
        $.ajax({
            url: `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
            method: 'GET',
            success: (data) => {
                console.log(data);
    
                // Store the Pokemon data
                pokemonData = pokemonData.concat(data.results);
    
                // Update the Pokemon list
                updatePokemonList(pokemonData);
    
                // Update the offset
                offset += limit;
            },
            error: (error) => {
                console.error('Error fetching Pokemon:', error);
            }        
        });
    }

    // Load Pokemon
    loadPokemon();

    // Load more Pokemon when the button is clicked
    $('#loadMore').click(() => {
        loadPokemon();
    });

    // Attach event listeners to buttons
    $('#sortById').click(() => sortAndDisplay('id'));
    $('#sortByName').click(() => sortAndDisplay('name'));
});