$(document).ready(function() {
    $('#load-more').click(function() {
        // Load more Pokemon
        $.get('/load-more', function(data) {
            data.forEach(pokemon => {
                // Make li element and store in variable
                const li = $(`<li>${pokemon.id} - ${pokemon.name}</li>`);
                
                // Append img to li
                if (pokemon.imageUrl) {
                    const img = $(`<img src="${pokemon.imageUrl}" alt="${pokemon.name}" />`);
                    li.append(img);
                }

                // Append li to ul
                $('#pokemon-list').append(li);
            });
        });
    });
});