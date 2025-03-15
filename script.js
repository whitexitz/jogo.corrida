const canvas = document.getElementById('jogoCanvas');
const ctx = canvas.getContext('2d');
const pontuacaoDisplay = document.getElementById('pontuacao');

canvas.width = 1366;
canvas.height = 768;

const carroJogador = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 100,
    largura: 50,
    altura: 80,
    velocidade: 5,
    imagem: new Image(),
};
carroJogador.imagem.src = 'skyline.png';

const carrosOponentes = [];

const estrada = {
    y: 0,
    altura: 200,
    velocidade: 3,
};

let pontuacao = 0;
let nivel = 1;

function desenharCarro(carro) {
    ctx.drawImage(carro.imagem, carro.x, carro.y, carro.largura, carro.altura);
}

function desenharEstrada() {
    ctx.fillStyle = 'gray';
    ctx.fillRect(0, estrada.y, canvas.width, estrada.altura);
    ctx.fillRect(0, estrada.y + estrada.altura * 2, canvas.width, estrada.altura);
}

function atualizar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    desenharEstrada();
    desenharCarro(carroJogador);

    carrosOponentes.forEach(carro => {
        desenharCarro(carro);
    });

    estrada.y += estrada.velocidade;
    if (estrada.y > estrada.altura) {
        estrada.y = 0;
    }

    carrosOponentes.forEach(carro => {
        carro.y += estrada.velocidade;
    });

    if (Math.random() < 0.02 * nivel) {
        const carroOponente = {
            x: Math.random() * (canvas.width - 50),
            y: -80,
            largura: 50,
            altura: 80,
            velocidade: 3 + nivel,
            imagem: new Image(),
        };
        carroOponente.imagem.src = 'carro_oponente.png';
        carrosOponentes.push(carroOponente);
    }

    for (let i = carrosOponentes.length - 1; i >= 0; i--) {
        if (carrosOponentes[i].y > canvas.height) {
            carrosOponentes.splice(i, 1);
            pontuacao += 10;
            pontuacaoDisplay.textContent = 'Pontuação: ' + pontuacao;
        }

        if (verificarColisao(carroJogador, carrosOponentes[i])) {
            alert('Fim de jogo! Pontuação: ' + pontuacao);
            document.location.reload();
        }
    }

    if (pontuacao >= nivel * 100) {
        nivel++;
        alert('Nível ' + nivel);
    }

    requestAnimationFrame(atualizar);
}

function verificarColisao(carro1, carro2) {
    return !(
        carro1.x > carro2.x + carro2.largura ||
        carro1.x + carro1.largura < carro2.x ||
        carro1.y > carro2.y + carro2.altura ||
        carro1.y + carro1.altura < carro2.y
    );
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' && carroJogador.x > 0) {
        carroJogador.x -= carroJogador.velocidade;
    } else if (event.key === 'ArrowRight' && carroJogador.x < canvas.width - carroJogador.largura) {
        carroJogador.x += carroJogador.velocidade;
    }
});

atualizar();