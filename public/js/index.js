$(document).ready(function() {
    $('#load-more').click(function() {
        // Load more Pokemon
        $.get('/load-more', function(data) {
            data.forEach(pokemon => {
                $('#pokemon-list').append(`<li>${pokemon.id} - ${pokemon.name}</li>`);
            });
        });
    });
});