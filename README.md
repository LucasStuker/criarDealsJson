<div align="center">

<h1>🤖 Sincronizador Inteligente para Bitrix24 🤖</h1>
<p>
<em>Um script para automatizar a criação de Contatos e Negócios no Bitrix24, lendo dados de um arquivo JSON, evitando duplicidade e organizando seu funil de vendas de forma eficiente.</em>
</p>

</div>

Este script automatizado lê uma lista de contatos de um arquivo JSON, verifica sua existência no Bitrix24 e, em seguida, cria um Contato (se necessário) e um Negócio (Deal), preenchendo campos para manter seu CRM sempre atualizado.

✨ Funcionalidades Principais
🔎 Verificação Anti-Duplicação: Usa o telefone para consultar a API do Bitrix24 e evitar a criação de contatos duplicados.

✍️ Criação Inteligente de Contatos: Se um contato não existe, ele é criado com o nome completo separado automaticamente em "Nome" e "Sobrenome".

🎯 Criação Direcionada de Negócios (Deals): Cria um novo negócio para cada contato e o insere diretamente no pipeline e estágio que você definir.

🏢 Associação de Empresas: Identifica e associa a empresa de um contato existente ao novo negócio.

🛡️ Segurança da API: Utiliza delays entre as requisições para não sobrecarregar a API do Bitrix24.

🚀 Guia Rápido de Uso
1. ✅ Pré-requisitos
Node.js: Versão 16 ou superior.

Arquivo de Dados: Um arquivo JSON (ex: dados_para_bitrix.json) na mesma pasta do projeto.

2. 📦 Instalação
Abra o terminal na pasta do projeto e instale a única dependência necessária, o axios:

npm install axios

3. ⚙️ Configuração
Abra o arquivo do script (ex: processarContatos.js) e preencha as constantes no topo do arquivo com os seus dados.

🚨 AVISO DE SEGURANÇA: Nunca preencha estas informações em um arquivo que será enviado para um repositório público. Este método é seguro apenas para uso local ou em repositórios privados.

const BITRIX_WEBHOOK = "[https://seusite.bitrix24.com.br/rest/1/abcdef123456/](https://seusite.bitrix24.com.br/rest/1/abcdef123456/)"; // SEU WEBHOOK AQUI
const JSON_PATH = "./dados_para_bitrix.json";
const DEAL_TITLE_BASE = "Prospecção Indicada"; // Título do Negócio
const PIPELINE_ID = 89; // 🎯 ID do Funil
const STAGE_ID = "C89:UC_HPXUQG"; // 🎯 Estágio do funil

4. ▶️ Execução
Com as constantes preenchidas, rode o script no terminal:

node processarContatos.js

Acompanhe o progresso em tempo real pelo console!

<div align="center"> <p>Criado por Lucas Stuker.</p> </div>
