// On document ready
$(document).ready(() => {
    let pokemonData = []; // Array to store Pokemon data
    const limit = 10;
    let offset = 0;

    // Function to load Pokemon
    loadPokemon = () => {
        $.ajax({
            url: `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
            method: 'GET',
            success: (data) => {
                console.log(data);
    
                // Store the Pokemon data
                pokemonData = pokemonData.concat(data.results);
    
                // Clear list
                $('#pokemonList').empty();
    
                // Append Pokemon names to the list
                pokemonData.forEach(pokemon => {
                    // Get ID
                    let pokemonID = pokemon.url.replace('https://pokeapi.co/api/v2/pokemon/', '').replace('/', '');

                    $('#pokemonList').append(`<li>${pokemonID}: ${pokemon.name}</li>`);
                });
    
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
});