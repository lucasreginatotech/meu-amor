// === 1. CONFIGURAÇÃO DO CONTADOR ===
// Data exata: Ano (2024), Mês menos 1 (9 = Outubro), Dia (10), Hora (20), Minutos (40), Segundos (0)
const dataInicio = new Date(2024, 9, 10, 20, 40, 0); 

function atualizarContador() {
    const agora = new Date();
    const diferenca = agora - dataInicio;

    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = dias < 10 ? "0" + dias : dias;
    document.getElementById("hours").innerText = horas < 10 ? "0" + horas : horas;
    document.getElementById("minutes").innerText = minutos < 10 ? "0" + minutos : minutos;
    document.getElementById("seconds").innerText = segundos < 10 ? "0" + segundos : segundos;
}

setInterval(atualizarContador, 1000);
atualizarContador();

// === 2. LÓGICA DO BOTÃO FUJÃO ===
function fuga() {
    const botaoNao = document.getElementById("btn-nao");
    const larguraJanela = window.innerWidth - 150;
    const alturaJanela = window.innerHeight - 100;
    const novoX = Math.random() * larguraJanela;
    const novoY = Math.random() * alturaJanela;
    
    botaoNao.style.position = "fixed";
    botaoNao.style.left = novoX + "px";
    botaoNao.style.top = novoY + "px";
}


// === 3. AÇÃO AO CLICAR EM SIM ===
function aceitou() {
    const mensagem = document.getElementById("mensagem-sucesso");
    mensagem.classList.remove("hidden");
    document.getElementById("btn-nao").style.display = "none";
}


// === 4. GERADOR DOS CORAÇÕES COM A SUA FOTO REAL ===
// ATENÇÃO: Deixe apenas ESTA lista de fotos. Apague as outras const que você criou.
const fotos = [
    'fotos.jpg/IMG_0344.jpeg',
    'fotos.jpg/IMG_6497.jpeg',  // Mude para o nome real da sua foto 2
    'fotos.jpg/IMG_8208.jpeg',  // Mude para o nome real da sua foto 3
    'fotos.jpg/IMG_9262.jpeg'   // Mude para o nome real da sua foto 4
];

const containerFundo = document.createElement('div');
containerFundo.classList.add('fundo-coracoes');
document.body.appendChild(containerFundo);

function criarCoracao() {
    const coracao = document.createElement('div');
    coracao.classList.add('coracao-foto');
    
    // O JavaScript agora escolhe uma das 4 fotos da lista acima de forma aleatória!
    const fotoAleatoria = fotos[Math.floor(Math.random() * fotos.length)];
    coracao.style.backgroundImage = `url('${fotoAleatoria}')`;
    
    coracao.style.left = Math.random() * 80 + 'vw'; // Mantém mais centralizado para não cortar nas bordas
    
    // AUMENTAMOS O TAMANHO: Agora eles vão nascer bem grandes (entre 180px e 260px)
    const tamanho = Math.random() * 80 + 180; 
    coracao.style.width = `${tamanho}px`;
    coracao.style.height = `${tamanho}px`;
    
    // Deixamos um pouco mais lento para dar tempo de ver a foto nitidamente enquanto sobe
    const duration = Math.random() * 6 + 10; 
    coracao.style.animationDuration = `${duration}s`;

    containerFundo.appendChild(coracao);
    
    setTimeout(() => {
        coracao.remove();
    }, duration * 1000);
}

// Solta um coração novo a cada 3 segundos (mais espaçado para não poluir a tela já que são grandes)
setInterval(criarCoracao, 2500);