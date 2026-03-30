const apiKey = '06d7e13d24e92b432899983ff4d9b99a'; 

const inputFilme = document.getElementById('input-filme');
const btnBuscar = document.getElementById('btn-buscar');
const gradeFilmes = document.getElementById('grade-filmes');

// Novas variáveis do Telão
const modalTrailer = document.getElementById('modal-trailer');
const playerVideo = document.getElementById('player-video');
const fecharModal = document.getElementById('fechar-modal');

// Ouve clique no botão e Enter
btnBuscar.addEventListener('click', () => pesquisar());
inputFilme.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') pesquisar();
});

// Fechar o Telão ao clicar no botão 'X'
fecharModal.addEventListener('click', () => {
    modalTrailer.style.display = 'none';
    playerVideo.src = ''; // Isso faz o vídeo parar de tocar no fundo!
});

function pesquisar() {
    const filme = inputFilme.value;
    if (filme !== '') buscarFilmes(filme);
}

async function buscarFilmes(nomeFilme) {
    try {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(nomeFilme)}&language=pt-BR`;
        const resposta = await fetch(url);
        const dados = await resposta.json();
        const filmes = dados.results;

        gradeFilmes.innerHTML = '';

        if (filmes.length === 0) {
            gradeFilmes.innerHTML = '<p>Nenhum filme encontrado.</p>';
            return;
        }

        filmes.forEach(filme => {
            if (filme.poster_path) {
                const urlImagem = `https://image.tmdb.org/t/p/w500${filme.poster_path}`;
                const cartao = document.createElement('div');
                cartao.className = 'cartao-filme';
                
                cartao.innerHTML = `
                    <img src="${urlImagem}" alt="${filme.title}">
                    <h3>${filme.title}</h3>
                `;
                
                // O SEGREDO: Quando clicar no cartão, chama o trailer usando o ID do filme!
                cartao.addEventListener('click', () => {
                    buscarTrailer(filme.id);
                });

                gradeFilmes.appendChild(cartao);
            }
        });

    } catch (error) {
        alert('Erro ao buscar filmes!');
        console.error(error);
    }
}

// A FUNÇÃO NOVA QUE BUSCA O VÍDEO
async function buscarTrailer(idFilme) {
    try {
        // Pede os vídeos desse filme específico
        const urlVideo = `https://api.themoviedb.org/3/movie/${idFilme}/videos?api_key=${apiKey}&language=pt-BR`;
        const resposta = await fetch(urlVideo);
        const dados = await resposta.json();

        // O TMDB manda vários vídeos, precisamos encontrar o que é um "Trailer" e do "YouTube"
        const trailer = dados.results.find(video => video.site === 'YouTube' && video.type === 'Trailer');

        if (trailer) {
            // Coloca a chave do YouTube no nosso player
            playerVideo.src = `https://www.youtube.com/embed/${trailer.key}`;
            // Mostra o Telão na tela (muda de none para flex)
            modalTrailer.style.display = 'flex';
        } else {
            // Caso o filme seja muito antigo ou não tenha trailer em português cadastrado
            alert('Poxa, não encontramos o trailer oficial dublado ou legendado para este filme. 😢');
        }

    } catch (error) {
        console.error('Erro ao buscar trailer', error);
    }
}