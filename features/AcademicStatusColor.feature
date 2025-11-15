Feature: Identificação de Situação Acadêmica por Cores
        As professor
        I want visualizar cada aluno da turma identificado por uma cor (verde, laranja ou vermelho), de acordo com seu histórico e desempenho atual
        So eu consigo identificar rapidamente quais alunos estão em situação regular, de atenção ou crítica, e agir preventivamente para apoiar aqueles em risco de reprovação

    Scenario: Exibição de cores na lista de alunos
    GIVEN estou logado como "Professor" com o login "egrab" e senha "123"
    AND estou na página "Lista de Alunos" da turma "Engenharia de Software (2025/1)"
    AND o aluno "João da Silva" está matriculado na turma
    AND a situação acadêmica de "João da Silva" é: "Frequência 90%", "Nota Parcial 8.5" e "0 Reprovações"
    AND o aluno "Maria de Souza" está matriculada na turma
    AND a situação acadêmica de "Maria de Souza" é: "Frequência 62%", "Nota Parcial 4.0" e "2 Reprovações"
    WHEN acesso a página "Lista de Alunos" e a lista de estudantes é totalmente carregada
    THEN vejo o aluno "João da Silva" exibido com o marcador de cor "Verde" 
    AND vejo o aluno "Maria de Souza" exibido com o marcador de cor "Vermelho"

    Scenario: Visualização do motivo da cor verde
    GIVEN estou logado como "Professor" com o login "egrab" e senha "123"
    AND estou na página "Lista de Alunos" da turma "Engenharia de Software (2025/1)"
    AND o aluno "João da Silva" está classificado com a cor "Verde"
    AND a situação acadêmica atual de "João da Silva" é: "Frequência 92%", "Nota Média Parcial 8.9" e "0 Reprovações"
    WHEN seleciono sobre o nome do aluno "João da Silva"
    THEN vejo uma o detalhamento da situação acadêmica
    AND o detalhamento exibe o status de classificação como "Situação Acadêmica Segura"
    AND vejo o motivo "Nota Média Parcial 8.9" com a descrição "Dentro da média de aprovação exigida"
    AND vejo o motivo "Frequência 92%" com a descrição "Acima do limite de aprovação por frequência"
    AND vejo o motivo "Reprovações Anteriores" com a descrição "Nenhuma reprovação detectada em pré-requisitos"

    Scenario: Atualização da cor verde para laranja após novo desempenho
    GIVEN estou logado como "Professor" com o login "egrab" e senha "123"
    AND estou na página "Lista de Alunos" da turma "Engenharia de Software (2025/1)"
    AND o aluno "Jose Silva" está matriculado na turma
    AND a situação inicial de "Jose Silva" é: "Nota Média Parcial 7.8" e "Frequência 85%" 
    WHEN registro no sistema a nova "Nota Parcial 2" de "4.0"
    AND confirmo o registro da nota, resultando na "Nota Média Parcial de 5.9" para "Jose Silva" 
    AND o sistema processa a atualização das métricas
    THEN a cor de classificação do aluno "Jose Silva" muda automaticamente de "Verde" para "Laranja"
    AND a nova classificação de "Jose Silva" na "Lista de Alunos" fica com a cor "Laranja"

    Scenario: Visualização do motivo da cor laranja
    GIVEN estou logado como "Professor" com o login "egrab" e senha "123"
    AND estou na página "Lista de Alunos" da turma "Engenharia de Software (2025/1)"
    AND o aluno "Carlos Souza" está classificado com a cor "Laranja"
    AND a situação acadêmica atual de "Carlos Souza" é: "Frequência 78%" , "Nota Média Parcial 5.8" e "0 Reprovações"
    WHEN seleciono sobre o nome do aluno "Carlos Souza"
    THEN vejo o detalhamento da situação acadêmica
    AND o detalhamento exibe o status de classificação como "Situação de Alerta"
    AND vejo o motivo "Nota Média Parcial 5.8" com a descrição "Abaixo da média de aprovação, mas com potencial de recuperação"
    AND vejo a observação "Ainda há 40% das avaliações a serem realizadas, com chance de reversão do status"
    AND vejo o motivo "Frequência 78%" com a descrição "Acima do limite de reprovação por falta"
    AND vejo o motivo "Reprovações Anteriores" com a descrição "Nenhuma reprovação detectada em pré-requisitos"

    Scenario: Visualização do motivo da cor vermelho
    GIVEN estou logado como "Professor" com o login "egrab" e senha "123"
    AND estou na página "Lista de Alunos" da turma "Engenharia de Software (2025/1)"
    AND o aluno "Maria Lima" está classificada com a cor "Vermelho"
    AND a situação acadêmica atual de "Maria Lima" é: "Frequência 64%" , "Nota Média Parcial 4.1" e "2 Reprovações em pré-requisitos"
    WHEN seleciono sobre o nome do aluno "Maria Lima"
    THEN vejo o detalhamento da situação acadêmica
    AND o detalhamento exibe o status de classificação como "Risco Crítico / Situação Irreversível"
    AND vejo o motivo "Frequência 64%" com a descrição "Abaixo do limite de reprovação por falta"
    AND vejo o motivo "Reprovações Anteriores" com a descrição "2 reprovações detectadas em disciplinas pré-requisito"
    AND vejo o motivo "Nota Média Parcial 4.1" com a descrição "Abaixo da nota de corte e do limite de recuperação"

    Scenario: Atualização da cor laranja para vermelho após novo desempenho
    GIVEN estou logado como "Professor" com o login "egrab" e senha "123"
    AND estou na página "Lista de Alunos" da turma "Engenharia de Software (2025/1)"
    AND o aluno "Ana Costa" está matriculada na turma
    AND a situação inicial de "Ana Costa" é: "Nota Média Parcial 6.5" e "Frequência 78%"
    WHEN registro no sistema as novas faltas que resultam na **Frequência Final de 68%**
    AND confirmo o registro de faltas, resultando na "Frequência Final de 68%" para "Ana Costa"
    AND o sistema processa a atualização das métricas
    THEN a cor de classificação do aluno "Ana Costa" muda automaticamente de "Laranja" para "Vermelho"
    AND a nova classificação de "Ana Costa" na "Lista de Alunos" fica com a cor "Vermelho"