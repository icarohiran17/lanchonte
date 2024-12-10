class StatusEntrega {
    constructor() {
        this.etapas = ['confirmado', 'preparando', 'caminho', 'entregue'];
        this.etapaAtual = 0;
        this.inicializar();
    }

    inicializar() {
        // Simular progresso automático
        this.atualizarStatus();
        this.iniciarSimulacao();

        // Atualizar tempo estimado
        this.atualizarTempoEstimado();
    }

    atualizarStatus() {
        const etapas = document.querySelectorAll('.status-step');
        
        etapas.forEach((etapa, index) => {
            const circulo = etapa.querySelector('.status-circle');
            
            if (index < this.etapaAtual) {
                // Etapas completadas
                etapa.classList.add('completed');
                circulo.innerHTML = '✓';
            } else if (index === this.etapaAtual) {
                // Etapa atual
                etapa.classList.add('active');
                circulo.innerHTML = this.getIconeEtapa(index);
            } else {
                // Etapas futuras
                etapa.classList.remove('completed', 'active');
                circulo.innerHTML = this.getIconeEtapa(index);
            }
        });
    }

    getIconeEtapa(index) {
        const icones = ['✓', '🔥', '🛵', '📦'];
        return icones[index];
    }

    iniciarSimulacao() {
        // Simular progresso a cada 10 segundos
        setInterval(() => {
            if (this.etapaAtual < this.etapas.length - 1) {
                this.etapaAtual++;
                this.atualizarStatus();
                this.mostrarNotificacao();
            }
        }, 10000);
    }

    atualizarTempoEstimado() {
        const tempoElement = document.querySelector('.tempo-estimado');
        if (tempoElement) {
            let minutos = 45;
            
            setInterval(() => {
                if (minutos > 0 && this.etapaAtual < this.etapas.length - 1) {
                    minutos--;
                    tempoElement.textContent = `${minutos} minutos`;
                }
            }, 60000); // Atualizar a cada minuto
        }
    }

    mostrarNotificacao() {
        const mensagens = [
            'Pedido confirmado! Já estamos preparando.',
            'Seu pedido está sendo preparado com todo carinho!',
            'Entregador a caminho! Fique atento.',
            'Pedido entregue! Bom apetite!'
        ];

        const notificacao = document.createElement('div');
        notificacao.className = 'notificacao';
        notificacao.textContent = mensagens[this.etapaAtual];
        
        document.body.appendChild(notificacao);
        
        setTimeout(() => {
            notificacao.classList.add('mostrar');
        }, 100);
        
        setTimeout(() => {
            notificacao.classList.remove('mostrar');
            setTimeout(() => notificacao.remove(), 300);
        }, 3000);
    }
}

// Adicionar estilos necessários
const estilos = `
    .status-step {
        opacity: 0.5;
        transition: all 0.3s;
    }

    .status-step.active {
        opacity: 1;
        transform: scale(1.1);
    }

    .status-step.completed {
        opacity: 1;
    }

    .status-circle {
        transition: all 0.3s;
    }

    .completed .status-circle {
        background-color: #4CAF50;
    }

    .active .status-circle {
        background-color: #e31837;
        transform: scale(1.2);
    }

    .notificacao {
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 1000;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
    }

    .notificacao.mostrar {
        opacity: 1;
        transform: translateY(0);
    }

    @media (max-width: 768px) {
        .notificacao {
            width: 90%;
            right: 5%;
            text-align: center;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = estilos;
document.head.appendChild(styleSheet);

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.statusEntrega = new StatusEntrega();
});
