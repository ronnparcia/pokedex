$(document).ready(function() {
    $('#load-more').click(function() {
        // Load more Pokemon
        $.get('/load-more', function(data) {
            data.forEach(pokemon => {
                // Make li element and store in variable
                const li = $(`<li>${pokemon.id} - ${pokemon.name}</li>`);

                // Make img element
                const img = $(`<img src="${pokemon.imageUrl}" alt="${pokemon.name}" />`);

                // Append img to li
                li.append(img);

                // Append li to ul
                $('#pokemon-list').append(li);

                // $('#pokemon-list').append(`<li></li>`);
            });
        });
    });
});