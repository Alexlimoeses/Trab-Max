// Espera o conteúdo da página carregar para executar o script
document.addEventListener("DOMContentLoaded", function() {
    
    // Pega os elementos do formulário e o container de resultados
    const form = document.getElementById("riskForm");
    const resultsDiv = document.getElementById("results");

    // Adiciona um "ouvinte" para quando o botão "Calcular" (submit) for clicado
    form.addEventListener("submit", function(event) {
        // Impede que a página recarregue (comportamento padrão do formulário)
        event.preventDefault(); 
        
        let totalScore = 0;
        
        // Indicadores que continuam como RADIO BUTTONS (seleção única)
        const radioIndicators = [
            'idade', 'polifarmacia', 'mobilidade', 'pps'
        ];
        
        // Indicadores que foram convertidos para CHECKBOXES (múltipla seleção)
        const checkboxIndicators = [
            'multimorbidade', 'dependencia', 'suporte', 'fragilidade'
        ];

        // Cria um objeto para pegar os dados do formulário
        const formData = new FormData(form);

        // 1. Loop para somar os pontos dos indicadores de RÁDIO
        radioIndicators.forEach(indicator => {
            // Pega o valor (pontos) do botão de rádio selecionado
            const value = formData.get(indicator);
            if (value) {
                totalScore += parseInt(value, 10);
            }
        });

        // 2. Loop para somar os pontos dos indicadores de CHECKBOXES
        checkboxIndicators.forEach(indicator => {
            // Pega todos os checkboxes marcados para o nome do indicador
            // Usa document.querySelectorAll pois FormData.get() não funciona bem com múltiplos checkboxes
            const checkboxes = document.querySelectorAll(`input[name="${indicator}"]:checked`);
            
            checkboxes.forEach(checkbox => {
                // Soma o valor de cada checkbox marcado
                totalScore += parseInt(checkbox.value, 10);
            });
        });

        // Determina a classificação e o tempo de visita
        const [classification, time, riskClass] = getClassification(totalScore);

        // Exibe o resultado formatado
        resultsDiv.innerHTML = `
            <h2>Resultado da Classificação</h2>
            <p>Escore Total: <span class="score">${totalScore}</span></p>
            <p>Classificação: <strong>${classification}</strong></p>
            <p>Tempo médio para planejamento das próximas visitas: <strong>${time}</strong></p>
        `;

        // Remove classes de risco anteriores e adiciona a nova
        resultsDiv.classList.remove('risco-baixo', 'risco-medio', 'risco-alto', 'risco-muito-alto');
        resultsDiv.classList.add(riskClass);
        
        // Mostra o container de resultados
        resultsDiv.style.display = "block";
    });

    // Adiciona um "ouvinte" para o botão "Limpar" (reset)
    form.addEventListener("reset", function() {
        // Esconde e limpa o container de resultados
        resultsDiv.style.display = "none";
        resultsDiv.innerHTML = "";
        resultsDiv.classList.remove('risco-baixo', 'risco-medio', 'risco-alto', 'risco-muito-alto');
    });

    // Função que retorna a classificação baseada no escore (Tabela 1)
    function getClassification(score) {
        if (score <= 5) {
            return ['Baixo', '6 meses a 1 ano', 'risco-baixo'];
        } else if (score >= 6 && score <= 10) {
            return ['Médio', '4 a 6 meses', 'risco-medio'];
        } else if (score >= 11 && score <= 15) {
            return ['Alto', '2 a 3 meses', 'risco-alto'];
        } else { // Maior que 16
            return ['Muito Alto', '1 a 2 meses', 'risco-muito-alto'];
        }
    }
});
