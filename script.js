const apiKey = '06d7e13d24e92b432899983ff4d9b99a'; // <-- Sua chave aqui!

const inputFilme = document.getElementById('input-filme');
const btnBuscar = document.getElementById('btn-buscar');
const gradeFilmes = document.getElementById('grade-filmes');
const modalTrailer = document.getElementById('modal-trailer');
const playerVideo = document.getElementById('player-video');
const fecharModal = document.getElementById('fechar-modal');

// Ouvintes de botões
btnBuscar.addEventListener('click', () => pesquisar());
inputFilme.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') pesquisar();
});

fecharModal.addEventListener('click', () => {
    modalTrailer.style.display = 'none';
    playerVideo.src = ''; 
});

// AQUI ESTÁ A OPÇÃO 3: Busca os filmes mais populares do momento
async function carregarPopulares() {
    try {
        // Pede para a API os filmes "popular"
        const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=pt-BR&page=1`;
        const resposta = await fetch(url);
        const dados = await resposta.json();
        
        // Manda os filmes para a nossa fábrica de cartões
        desenharGrade(dados.results);
    } catch (error) {
        console.error('Erro ao carregar populares', error);
    }
}

// A função de pesquisa (agora ficou mais limpa!)
async function buscarFilmes(nomeFilme) {
    try {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(nomeFilme)}&language=pt-BR`;
        const resposta = await fetch(url);
        const dados = await resposta.json();

        if (dados.results.length === 0) {
            gradeFilmes.innerHTML = '<p>Nenhum filme encontrado.</p>';
            return;
        }

        // Manda os filmes pesquisados para a fábrica de cartões
        desenharGrade(dados.results);
    } catch (error) {
        alert('Erro ao buscar filmes!');
    }
}

function pesquisar() {
    const filme = inputFilme.value;
    if (filme !== '') buscarFilmes(filme);
}

// A FÁBRICA DE CARTÕES (OPÇÃO 2 ESTÁ AQUI!)
// Centralizamos a criação do HTML aqui para não repetir código
function desenharGrade(filmes) {
    gradeFilmes.innerHTML = ''; // Limpa a tela

    filmes.forEach(filme => {
        if (filme.poster_path) {
            const urlImagem = `https://image.tmdb.org/t/p/w500${filme.poster_path}`;
            const cartao = document.createElement('div');
            cartao.className = 'cartao-filme';
            
            // OPÇÃO 2: Pegando o ano e a nota
            // O ano vem como "2024-07-25", o substring(0,4) pega só os 4 primeiros números!
            const ano = filme.release_date ? filme.release_date.substring(0, 4) : 'N/D';
            // Arredonda a nota para 1 casa decimal (ex: 8.5)
            const nota = filme.vote_average ? filme.vote_average.toFixed(1) : '-';
            
            cartao.innerHTML = `
                <img src="${urlImagem}" alt="${filme.title}">
                <h3>${filme.title}</h3>
                <p>⭐ ${nota} | 📅 ${ano}</p>
            `;
            
            cartao.addEventListener('click', () => {
                buscarTrailer(filme.id);
            });

            gradeFilmes.appendChild(cartao);
        }
    });
}

// Busca o Trailer (Continua igual)
async function buscarTrailer(idFilme) {
    try {
        const urlVideo = `https://api.themoviedb.org/3/movie/${idFilme}/videos?api_key=${apiKey}&language=pt-BR`;
        const resposta = await fetch(urlVideo);
        const dados = await resposta.json();
        const trailer = dados.results.find(video => video.site === 'YouTube' && video.type === 'Trailer');

        if (trailer) {
            playerVideo.src = `https://www.youtube.com/embed/${trailer.key}`;
            modalTrailer.style.display = 'flex';
        } else {
            alert('Poxa, não encontramos o trailer oficial dublado ou legendado para este filme. 😢');
        }
    } catch (error) {
        console.error('Erro ao buscar trailer', error);
    }
}

// O GRANDE TRUQUE: Executa a função de populares assim que o site abre!
carregarPopulares();
