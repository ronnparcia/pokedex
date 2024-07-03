$(document).ready(function() {
    $('#load-more').click(function() {
        // Load more Pokemon
        $.get('/load-more', function(data) {
            data.forEach(pokemon => {
                // Generate the Pokemon card
                const pokemonCard = generatePokemonCard(pokemon);
                
                // Append the card to the container
                $('#pokemon-grid').append(pokemonCard);

                // // Make li element and store in variable
                // const li = $(`<li>${pokemon.id} - ${pokemon.name}</li>`);
                
                // // Append img to li
                // if (pokemon.imageUrl) {
                //     const img = $(`<img src="${pokemon.imageUrl}" alt="${pokemon.name}" />`);
                //     li.append(img);
                // }

                // // Append li to ul
                // $('#pokemon-list').append(li);
            });
        });
    });

    function generatePokemonCard(pokemon) {
        // Make card element and store in variable
        const card = $(`
            <div class="col">
                <a href="/pokemon/${pokemon.id}">
                    <div class="card">
                        <div class="row g-0">
                        </div>
                    </div>
                </a>
            </div>
        `);
    
        // Image wrapper
        const imgWrapper = $('<div class="card-img-wrapper col-4"></div>');
        if (pokemon.imageUrl) {
            const img = $(`<img src="${pokemon.imageUrl}" alt="${pokemon.name}">`);
            imgWrapper.append(img);
        }
    
        // Card body
        const cardBody = $(`
            <div class="col-8">
                <div class="card-body">
                    <h5 class="card-title">${pokemon.name}</h5>
                    <p class="card-text"><small class="text-body-secondary">ID No. ${pokemon.id}</small></p>
                </div>
            </div>
        `);
    
        // Append image wrapper and card body to the card
        card.find('.row').append(imgWrapper).append(cardBody);
    
        return card;
    }
            
});