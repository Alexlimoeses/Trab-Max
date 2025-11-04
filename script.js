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
        
        // Pega todos os nomes dos campos do formulário (sem 'fragilidade')
        const indicators = [
            'idade', 'multimorbidade', 'polifarmacia', 
            'dependencia', 'mobilidade', 'suporte', 
            'pps'
        ];

        // Cria um objeto para pegar os dados do formulário
        const formData = new FormData(form);

        // 1. Loop para somar os pontos dos indicadores de RÁDIO
        indicators.forEach(indicator => {
            // Pega o valor (pontos) do botão de rádio selecionado
            const value = formData.get(indicator);
            if (value) {
                totalScore += parseInt(value, 10);
            }
        });
        
        // 2. TRATAMENTO ESPECÍFICO PARA FRAGILIDADE (CHECKBOXES)
        // Pega todos os checkboxes de fragilidade que estão MARCADOSe possuem o nome 'fragilidade'
        const fragilityCheckboxes = document.querySelectorAll('input[name="fragilidade"]:checked');
        
        fragilityCheckboxes.forEach(checkbox => {
            // Soma o valor de cada checkbox marcado (e converte para número)
            totalScore += parseInt(checkbox.value, 10);
        });
        // FIM DO TRATAMENTO ESPECÍFICO
        
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

    // ... (o restante do script permanece o mesmo) ...
