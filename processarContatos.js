import fs from "fs";
import axios from "axios";

const BITRIX_WEBHOOK = ""; // SEU WEBHOOK AQUI
const JSON_PATH = "./dados_extraidos_corrigido.json";
const DEAL_TITLE_BASE = "Prospeccao_indicação";
const PIPELINE_ID = 89; // 🎯 ID do Funil
const STAGE_ID = "C89:PREPAYMENT_INVOIC"; // 🎯 ID do Estágio

// Função para adicionar um pequeno delay e não sobrecarregar a API
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function buscarContatoPorTelefone(telefone) {
  if (!telefone) return null;
  await delay(500);

  try {
    const response = await axios.post(`${BITRIX_WEBHOOK}crm.contact.list`, {
      filter: { PHONE: telefone },
      select: ["ID", "NAME", "LAST_NAME", "COMPANY_ID"],
    });
    return response.data.result[0] || null;
  } catch (error) {
    console.error("Deu ruim, verifica seu animal ", error.message);
    return null;
  }
}

async function criarContato(nomeCompleto, telefone) {
  await delay(500);

  const partesNome = nomeCompleto.trim().split(/\s+/);
  const primeiroNome = partesNome.shift() || "";
  const sobrenome = partesNome.join(" ");
  try {
    const response = await axios.post(`${BITRIX_WEBHOOK}crm.contact.add`, {
      fields: {
        NAME: primeiroNome,
        LAST_NAME: sobrenome,
        PHONE: [{ VALUE: telefone, VALUE_TYPE: "WORK" }],
        OPENED: "Y",
      },
    });
    console.log(`Contato criado: ${primeiroNome}, ${sobrenome}`);
    return response.data.result;
  } catch (error) {
    console.error("Erro ao criar contato");
    return null;
  }
}

async function buscarNomeEmpresa(companyId) {
  if (!companyId) return null;
  await delay(5000);
  try {
    const response = await axios.post(`${BITRIX_WEBHOOK}crm.company.get`, {
      id: companyId,
    });
    return response.data.result.TITLE || null;
  } catch (error) {
    console.error("Deu ruim nessa empresa");
    return null;
  }
}

//Cria um negócio dinamicamente com o a empresa e o contatoi

async function criarNegocioParaContato(contato) {
  await delay(5000);

  const nomeEmpresa = await buscarNomeEmpresa(contato.COMPANY_ID);
  const nomeCompleto = `${contato.NAME || ""} ${
    contato.LAST_NAME || ""
  }`.trim();
  let tituloFinal = `${DEAL_TITLE_BASE} - ${contato.NAME}`;

  if (nomeEmpresa) {
    tituloFinal += `(${nomeEmpresa})`;
  }

  try {
    await axios.post(`${BITRIX_WEBHOOK}crm.deal.add`, {
      fields: {
        TITLE: tituloFinal,
        CONTACT_ID: contato.ID,
        COMPANY_ID: contato.COMPANY_ID || 0,
      },
    });
    console.log(
      `✅ Negócio criado: "${tituloFinal}" (Contato ID: ${contato.ID})`
    );
  } catch (error) {
    console.error(`Erro ao criar negócio para ${nomeCompleto}:`);
  }
}

async function processarContatosDoJson() {
  let dados;
  try {
    const fileContent = fs.readFileSync(JSON_PATH, "utf8");
    dados = JSON.parse(fileContent);
  } catch (error) {
    console.error("Erro no json, parça.");
    return;
  }
  const contatosValidos = dados.filter(
    (c) => c["Numero do Telefone"] && c["Nome"]
  );
  console.log(
    `Arquivo JSON lido. ${contatosValidos.length} contatos com telefone encontrados.`
  );
  console.log("Iniciando processamento...");

  for (const contatoJson of contatosValidos) {
    const nomeJson = contatoJson["Nome"];
    const telefoneJson = contatoJson["Numero do Telefone"];

    console.log(`-----------------------------------------------------`);
    console.log(`🔎 Processando: ${nomeJson} - ${telefoneJson}`);

    const contatoExistente = await buscarContatoPorTelefone(telefoneJson);

    if (contatoExistente) {
      console.log(
        `Contato já existe: ${contatoExistente.NAME} (ID: ${contatoExistente.ID})`
      );
      await criarNegocioParaContato(contatoExistente);
    } else {
      console.log(
        "Contato não encontrado. Criando em 3... 2... 1... 4... To de brinks"
      );
      const novoContatoId = await criarContato(nomeJson, telefoneJson);
      if (novoContatoId) {
        const partesNome = nomeJson.trim().split(/\s+/);
        const primeiroNome = partesNome.shift() || "";
        const sobrenome = partesNome.join(" ");
        await criarNegocioParaContato({
          ID: novoContatoId,
          NAME: primeiroNome,
          LAST_NAME: sobrenome,
        });
      } else {
        console.log(`Falha ao processar o ${nomeJson}(${telefoneJson})`);
      }
    }
  }

  console.log(`-----------------------------------------------------`);
  console.log("🏁 Processamento finalizado.");
}
if (!BITRIX_WEBHOOK) {
  console.error(
    "\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  );
  console.error("!!! Antes de rodar, coloque sua URL no BITRIX_WEBHOOK, !!!");
  console.error(
    "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n"
  );
} else {
  processarContatosDoJson();
}
