Feature: Visualização de Notas
    As a aluno do sistema
    I want to visualizar minhas notas e frequência
    So that eu possa entender se estou aprovado, na final ou reprovado

    Scenario: Aluno verificando que está reprovado por falta
            Given eu estou logado como "aluno" com login "maacj" e senha "12345"
            And estou na página "Ver nota" da turma "Engenharia de Software"
            When eu vejo que minha "frequência" é menor que "75%"
            And há indicação visual na cor vermelha ao lado do local onde fica a média
            Then eu sei que estou reprovado por falta

    Scenario: Aluno verificando que foi aprovado na final
            Given eu estou logado como "aluno" com login "maacj" e senha "12345"
            And estou na página "Ver nota" da turma "Engenharia de Software"
            And eu fiz a prova final
            When eu vejo a "média" entre a "prova final" e a "média geral" é "6,5"
            And há indicação visual na cor verde ao lado da média final
            Then eu sei que fui aprovado na final

    Scenario: Aluno verificar se está na final
            Given eu estou logado como "aluno" com login "maacj" e senha "12345"
            And estou na página "Ver nota" da turma "Engenharia de Software"
            When eu vejo a minha "média", que é "4,8"
            And há indicação visual na cor laranja ao lado da nota
            Then eu sei que estou na final

    Scenario: Aluno verificando que foi aprovado por média
            Given eu estou logado como "aluno" com login "maacj" e senha "12345"
            And estou na página "Ver nota" da turma "Engenharia de Software"
            When eu vejo que a "média" é "8,1"
            And há indicação visual na cor verde ao lado da média
            Then eu sei que estou aprovado