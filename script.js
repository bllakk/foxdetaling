document.addEventListener("DOMContentLoaded", () => {
  const apiUrl =
    "https://script.googleusercontent.com/macros/echo?user_content_key=fpdV_bvke4Ysc7T76XLPHxfVd5uEs8mBIOGPfY7BRvhjbYlWk3k5eTO11Ti5Zj06lhHFIv_x7KXa97Vs8nXQgsAk_rCLiAEym5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnL4OnYgUmOqZH-bFeK3uDLxdZVAAhQcAM303hsJv4c-71_blZrk-5c4kT3MKHfeVRT7vdtc6-WezMkJliIcwjmrWli9ioJTdAtz9Jw9Md8uu&lib=MIeZv8l1QePHE5HmXdrQZtNcQzCh8ojbJ"; // Substitua pela sua URL de API

  // Função para consumir a API
  async function fetchData() {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      // Encontrar o item mais próximo da data e hora atual, ignorando os passados
      const { closestItem, otherItems } = findClosestItem(data);

      console.log(data);
      displayData(closestItem, otherItems);
    } catch (error) {
      console.error("Erro ao buscar os dados:", error);
    }
  }

  // Função para encontrar o item mais próximo da data e hora atual, ignorando os passados
  function findClosestItem(data) {
    const now = new Date();
    let closest = null;
    let minDiff = Infinity;
    const otherItems = [];

    data.forEach((item) => {
      const itemDateTime = new Date(`${item.data}T${item.hora}`);

      // Ignorar atendimentos passados
      if (itemDateTime < now) {
        return;
      }

      const diff = Math.abs(now - itemDateTime); // Diferença em milissegundos

      if (diff < minDiff) {
        minDiff = diff;
        closest = item;
      } else {
        otherItems.push(item); // Armazenar os outros itens mais distantes
      }
    });

    return { closestItem: closest, otherItems: otherItems };
  }

  // Função para exibir os dados nas tabelas
  function displayData(closestItem, otherItems) {
    const tableBody1 = document.querySelector(".table-1 tbody");
    const tableBody2 = document.querySelector(".table-2 tbody");

    // Limpar as tabelas antes de preencher
    tableBody1.innerHTML = "";
    tableBody2.innerHTML = "";

    // Exibir o atendimento mais próximo na table-1
    if (closestItem) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${closestItem.nome}</td>
        <td>${closestItem.modeloCarro}</td>
        <td>${closestItem.servico}</td>
        <td class="end">${closestItem.hora}</td>
      `;
      tableBody1.appendChild(row);
    }

    // Exibir os outros atendimentos na table-2
    otherItems.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.nome}</td>
        <td>${item.modeloCarro}</td>
        <td>${item.servico}</td>
        <td class="end">${item.hora}</td>
      `;
      tableBody2.appendChild(row);
    });
  }

  // Chamar a função para buscar e exibir os dados
  fetchData();
});
