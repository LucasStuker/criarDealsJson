Sincronizador de Contatos e Negócios para Bitrix24
Este é um script automatizado em Node.js projetado para ler uma lista de contatos de um arquivo JSON, verificar sua existência no Bitrix24 e, em seguida, criar ou atualizar registros de Contato e Negócio (Deal) de forma inteligente.

O objetivo principal é evitar a duplicação de contatos e garantir que novas oportunidades de prospecção sejam inseridas corretamente em um funil de vendas específico.

✨ Funcionalidades
Leitura de Dados Locais: Lê os contatos a partir de um arquivo dados_extraidos_corrigido.json.

Verificação Anti-Duplicação: Consulta a API do Bitrix24 para verificar se um contato já existe com base no número de telefone.

Criação Inteligente de Contatos:

Se um contato não existe, ele é criado.

O nome completo é separado automaticamente em "Nome" e "Sobrenome" para melhor organização no CRM.

Criação de Negócios (Deals):

Cria um novo negócio para cada contato processado (seja ele novo ou existente).

Associa o negócio ao contato e, se existir, à empresa vinculada.

O título do negócio é gerado dinamicamente com o nome do contato e da empresa.

O negócio é inserido diretamente em um pipeline e estágio específicos.

Segurança da API: Utiliza delays entre as requisições para não sobrecarregar a API do Bitrix24 e evitar bloqueios.

🚀 Como Usar
Siga os passos abaixo para configurar e executar o script.

1. Pré-requisitos
Node.js: Certifique-se de ter o Node.js instalado em sua máquina. (Versão 16 ou superior recomendada).

Arquivo de Dados: O arquivo dados_extraidos_corrigido.json deve estar presente na mesma pasta do script.

2. Instalação
Abra o terminal na pasta do projeto e instale a única dependência necessária, o axios:

Bash

npm install axios
3. Configuração
Antes de rodar, você precisa configurar as constantes no topo do arquivo do script (processarContatosFinal.js):

Constante	Descrição	Exemplo
BITRIX_WEBHOOK	(Obrigatório) A URL do seu webhook de entrada do Bitrix24 com permissão para CRM. Você a obtém em Desenvolvedores -> Outro -> Webhook de entrada.	'https://seusite.bitrix24.com.br/rest/1/abcdef123456/'
JSON_PATH	O caminho para o arquivo de dados. O padrão é o arquivo que geramos.	'./dados_extraidos_corrigido.json'
DEAL_TITLE_BASE	O texto base para o título de todos os negócios criados.	'Prospeccao_indicação'
PIPELINE_ID	O ID numérico do funil (pipeline) de vendas onde os negócios serão criados.	89
STAGE_ID	O ID do estágio dentro do funil de destino. Geralmente no formato C[ID_PIPELINE]:[NOME_DO_ESTAGIO].	'C89:PREPAYMENT_INVOIC'

Exportar para as Planilhas
4. Execução
Com tudo configurado, execute o script com o seguinte comando no terminal:

Bash

node processarContatosFinal.js
O script começará a processar cada contato, exibindo o progresso e os resultados de cada operação diretamente no console.

⚙️ Lógica do Processamento
O script segue um fluxo sequencial e cuidadoso para cada contato encontrado no arquivo JSON:

Busca: O telefone do contato é usado para fazer uma busca na API do Bitrix24.

Decisão:

Se o contato é encontrado: O script pega o ID, nome, sobrenome e ID da empresa existentes.

Se o contato não é encontrado: O script o cria, separando o nome completo em primeiro nome e sobrenome.

Busca de Empresa (se aplicável): Se o contato existente possuir um ID de empresa, o script faz uma nova consulta para obter o nome da empresa.

Criação do Negócio: Por fim, o script cria um novo negócio com um título dinâmico (Prospeccao_indicação - Nome do Contato (Nome da Empresa)) e o insere diretamente no pipeline e estágio configurados.
