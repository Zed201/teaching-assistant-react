Feature: importação de Notas
    As a professor do sistema
    I want to importar notas de um CSV para a minha turma
    So that eu possa consolidar o desempenho da minha turma.

    Scenario: Upload de arquivo de notas com sucesso
    Given O usuário seleciona um arquivo CSV ou XLSX para importação
    When Uma requisição POST com o arquivo é enviada para "/api/classes/gradeImport/:classId"
    Then O status da resposta deve ser "200"
    And O JSON da resposta deve conter:
        | key            | value                  |
        | session_string | qualquer string        |
        | file_columns   | lista de colunas       |
        | mapping_columns| lista de colunas alvo  |

    Scenario: Upload de arquivo inválido
    Given O usuário seleciona um arquivo que não é CSV ou XLSX
    When Uma requisição POST com o arquivo é enviada para "/api/classes/gradeImport/:classId"
    Then O status da resposta deve ser "400"
    And O JSON da resposta deve conter uma mensagem de erro explicando que o arquivo é inválido.

    Scenario: Envio de mapeamento de colunas para goals
    Given O usuário possui um "session_string" retornado do upload do arquivo
    And O usuário preparou um mapeamento JSON da forma {"coluna_planilha": "goal"}
    When Uma requisição POST com JSON contendo "session_string" e "mapping" é enviada para "/api/classes/gradeImport/:classId"
    Then O status da resposta deve ser "200"
    And O JSON da resposta deve indicar que o parse das notas foi realizado com sucesso.
