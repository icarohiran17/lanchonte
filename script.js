class CarrinhoCompras {
    constructor() {
        this.itens = [];
        this.inicializar();
        this.criarEstilosNotificacao();
    }

    criarEstilosNotificacao() {
        const estilos = `
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

            .notificacao.erro {
                background-color: #f44336;
            }

            .notificacao.mostrar {
                opacity: 1;
                transform: translateY(0);
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = estilos;
        document.head.appendChild(styleSheet);
    }

    mostrarNotificacao(mensagem, tipo = 'sucesso') {
        const notificacao = document.createElement('div');
        notificacao.className = `notificacao ${tipo === 'erro' ? 'erro' : ''}`;
        notificacao.textContent = mensagem;
        
        document.body.appendChild(notificacao);
        
        setTimeout(() => notificacao.classList.add('mostrar'), 100);
        
        setTimeout(() => {
            notificacao.classList.remove('mostrar');
            setTimeout(() => notificacao.remove(), 300);
        }, 3000);
    }

    inicializar() {
        // Adicionar itens ao carrinho
        const botoesAdicionar = document.querySelectorAll('.add-to-cart');
        botoesAdicionar.forEach(botao => {
            botao.addEventListener('click', () => {
                const item = botao.closest('.menu-item');
                const nome = item.querySelector('h3').textContent;
                const preco = parseFloat(item.querySelector('.price').textContent.replace('R$ ', ''));
                
                this.adicionarItem({ nome, preco });
                
                // Feedback visual do botão
                botao.textContent = '✓ Adicionado';
                botao.style.backgroundColor = '#4CAF50';
                
                setTimeout(() => {
                    botao.textContent = 'Adicionar ao Carrinho';
                    botao.style.backgroundColor = '';
                }, 1500);
            });
        });

        // Finalizar pedido
        const botaoFinalizar = document.getElementById('checkout-btn');
        if (botaoFinalizar) {
            botaoFinalizar.addEventListener('click', () => {
                if (this.itens.length > 0) {
                    this.mostrarModal();
                } else {
                    this.mostrarNotificacao('Adicione itens ao carrinho primeiro!', 'erro');
                }
            });
        }

        // Fechar modal
        const botaoFechar = document.querySelector('.close');
        if (botaoFechar) {
            botaoFechar.addEventListener('click', () => {
                document.getElementById('checkout-modal').style.display = 'none';
            });
        }

        // Enviar pedido
        const formulario = document.getElementById('checkout-form');
        if (formulario) {
            formulario.addEventListener('submit', (e) => {
                e.preventDefault();
                this.enviarPedido();
            });
        }
    }

    adicionarItem(item) {
        const itemExistente = this.itens.find(i => i.nome === item.nome);
        
        if (!itemExistente) {
            this.itens.push(item);
            this.atualizarCarrinho();
            this.mostrarNotificacao(`${item.nome} adicionado ao carrinho!`);
        } else {
            this.mostrarNotificacao('Este item já está no carrinho!', 'erro');
        }
    }

    atualizarCarrinho() {
        const listaItens = document.querySelector('.cart-items');
        const total = document.getElementById('total-amount');
        
        if (listaItens && total) {
            listaItens.innerHTML = '';
            let valorTotal = 0;
            
            this.itens.forEach(item => {
                valorTotal += item.preco;
                
                listaItens.innerHTML += `
                    <div class="cart-item">
                        <span>${item.nome}</span>
                        <span>R$ ${item.preco.toFixed(2)}</span>
                    </div>
                `;
            });
            
            total.textContent = valorTotal.toFixed(2);
        }
    }

    mostrarModal() {
        const modal = document.getElementById('checkout-modal');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    enviarPedido() {
        const dados = {
            itens: this.itens,
            total: parseFloat(document.getElementById('total-amount').textContent),
            cliente: {
                nome: document.getElementById('name').value,
                telefone: document.getElementById('phone').value,
                endereco: document.getElementById('address').value,
                observacoes: document.getElementById('notes').value
            }
        };

        
        
        this.itens = [];
        this.atualizarCarrinho();
        document.getElementById('checkout-modal').style.display = 'none';
        document.getElementById('checkout-form').reset();
        alert('Pedido enviado com sucesso!');
    }

    formatarMensagem(dados) {
        let mensagem = `🍔 NOVO PEDIDO - BURGER HOUSE 🍔\n\n`;
        mensagem += `ITENS:\n`;
        
        dados.itens.forEach(item => {
            mensagem += `• ${item.nome} - R$ ${item.preco.toFixed(2)}\n`;
        });
        
        mensagem += `\nTOTAL: R$ ${dados.total}\n\n`;
        mensagem += `DADOS PARA ENTREGA:\n`;
        mensagem += `Nome: ${dados.cliente.nome}\n`;
        mensagem += `Telefone: ${dados.cliente.telefone}\n`;
        mensagem += `Endereço: ${dados.cliente.endereco}\n`;
        
        if (dados.cliente.observacoes) {
            mensagem += `\nObservações:\n${dados.cliente.observacoes}`;
        }
        
        return mensagem;
    }
}

// Iniciar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.carrinho = new CarrinhoCompras();
});