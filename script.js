document.addEventListener('DOMContentLoaded', () => {
    const leadForm = document.getElementById('leadForm');

    leadForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Impede o recarregamento da página

        // Elementos do formulário e mensagem
        const nomeInput = document.getElementById('nome');
        const dddInput = document.getElementById('ddd');
        const telefoneInput = document.getElementById('telefone');
        const submitButton = document.querySelector('.submit-btn');
        const messageDiv = document.getElementById('message');

        // Resetando a mensagem
        showMessage('', 'none');

        // 1. Coleta e validação dos dados
        const nome = nomeInput.value.trim();
        const ddd = dddInput.value.trim();
        const telefone = telefoneInput.value.trim();

        if (nome.length < 2) {
            showMessage('O nome completo deve ter pelo menos 2 caracteres.', 'error');
            return;
        }
        if (!/^\d{2}$/.test(ddd)) {
            showMessage('O DDD deve conter exatamente 2 dígitos.', 'error');
            return;
        }
        // Validação do telefone: apenas dígitos e hífen, entre 9 e 10 caracteres
        if (!/^[\d-]+$/.test(telefone) || telefone.length > 10 || telefone.length < 9) {
            showMessage('O telefone deve ter entre 9 e 10 caracteres (ex: 99999-9999).', 'error');
            return;
        }

        // 2. Preparação dos dados para a API
        const telefoneCompleto = `(${ddd}) ${telefone}`;
        const leadData = {
            nome: nome,
            telefone: telefoneCompleto
        };

        // 3. Configurações da API do Supabase
        const supabaseUrl = 'https://hvvlpigxtuqkdkdnkhko.supabase.co/rest/v1/Leads';
        const supabaseApiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2dmxwaWd4dHVxa2RrZG5raGtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNjk0MzQsImV4cCI6MjA2ODk0NTQzNH0.suL5v50e2Hvoj0-Gkl412znHRuhC8lGYA4jUi5C-XTs';

        // Desabilita o botão para evitar múltiplos envios
        submitButton.disabled = true;
        submitButton.textContent = 'ENVIANDO...';

        try {
            // 4. Envio dos dados para o Supabase via API REST
            const response = await fetch(supabaseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': supabaseApiKey,
                    'Authorization': `Bearer ${supabaseApiKey}`,
                    'Prefer': 'return=minimal' // Evita que a API retorne os dados inseridos
                },
                body: JSON.stringify(leadData)
            });

            // 5. Tratamento da resposta
            if (response.ok) {
                showMessage('Cadastro realizado com sucesso!', 'success');
                leadForm.reset(); // Limpa o formulário
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || `Erro ${response.status}: Não foi possível realizar o cadastro.`;
                showMessage(errorMessage, 'error');
            }

        } catch (error) {
            console.error('Erro na requisição:', error);
            showMessage('Erro de conexão. Por favor, tente novamente.', 'error');
        } finally {
            // Reabilita o botão após a conclusão
            submitButton.disabled = false;
            submitButton.textContent = 'CADASTRAR';
        }
    });

    // Função auxiliar para exibir mensagens
    function showMessage(text, type) {
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = text;
        
        // Remove classes antigas e adiciona a nova
        messageDiv.className = 'message';
        if (type === 'success' || type === 'error') {
            messageDiv.classList.add(type);
            messageDiv.style.display = 'block';
        } else {
            messageDiv.style.display = 'none';
        }
    }
});
