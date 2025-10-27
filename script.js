import { createIcons, icons } from "https://cdn.jsdelivr.net/npm/lucide@latest/+esm";

document.addEventListener("DOMContentLoaded", async () => {
  const tbody = document.getElementById("ranking-body");
  const totalContas = document.getElementById("total-contas");
  const lastUpdate = document.getElementById("last-update");
  const filterRCA = document.getElementById("filter-rca");
  const filterGraficoRCA = document.getElementById("filter-grafico-rca");
  const sortBy = document.getElementById("sort-by");
  const rankingTitle = document.getElementById("ranking-title");
  const ctx = document.getElementById('graficoLinha').getContext('2d');

  createIcons({ icons });

  document.getElementById("export-pdf").addEventListener("click", () => {
    window.print();
  });

  let originalData = [];

  async function loadData() {
    try {
      const response = await fetch("http://192.168.1.102:3006/contacorrente");
      const data = await response.json();
      originalData = data;

      totalContas.textContent = data.length;
      lastUpdate.textContent = new Date().toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });

      applyFilters();
      populateRCADropdown(data);

      const rcaInicial = data[0]?.rca;
      if (rcaInicial) {
          loadGrafico(rcaInicial);      // gráfico do dia
          loadGraficoMes(rcaInicial);   // gráfico do mês
      }


    } catch (error) {
      console.error("Erro ao carregar os dados:", error);
      tbody.innerHTML = `<tr><td colspan="5">Erro ao carregar os dados da API.</td></tr>`;
    }
  }

  function populateRCADropdown(data) {
    const rcasUnicos = [...new Set(data.map(item => item.rca))].sort((a,b) => a-b);
    filterGraficoRCA.innerHTML = '<option value="">Selecione RCA</option>';
    rcasUnicos.forEach(rca => {
      const option = document.createElement("option");
      option.value = rca;
      option.textContent = `RCA ${rca}`;
      filterGraficoRCA.appendChild(option);
    });
  }

 filterGraficoRCA.addEventListener("change", () => {
  const rcaSelecionado = filterGraficoRCA.value;
  if (rcaSelecionado) {
    loadGrafico(rcaSelecionado);  // chamar o gráfico dia
    loadGraficoMes(rcaSelecionado); // 🔹 chama também o gráfico mensal
  }
});

  document.getElementById("refresh-button").addEventListener("click", loadData);
  await loadData();
  setInterval(loadData, 5 * 60 * 1000);

  filterRCA.addEventListener("change", () => {
    applyFilters();
    const selectedRange = filterRCA.value;
    if (selectedRange !== "all") {
      const rca = selectedRange.split("-")[0];
      loadGrafico(rca);
    }
  });

  function applyFilters() {
    let filtered = [];
    const selectedRange = filterRCA.value;
    if (selectedRange === "all") filtered = [...originalData];
    else {
      const [start, end] = selectedRange.split("-").map(Number);
      filtered = originalData.filter((_, index) => index >= start - 1 && index < end);
    }

    const order = sortBy?.value;

    if (order === "saldo") filtered.sort((a,b)=>b.saldo-a.saldo);
    else if (order === "nome") filtered.sort((a,b)=>a.nome.localeCompare(b.nome));
    else if (order === "rca") filtered.sort((a,b)=>a.rca-b.rca);

    renderTable(filtered);
  }

  function renderTable(data) {
    tbody.innerHTML = "";
    data.forEach((item,index) => {
      const tr = document.createElement("tr");
      let highlightClass = "";
      if(index===0) highlightClass="row-highlight-gold";
      else if(index===1) highlightClass="row-highlight-silver";
      else if(index===2) highlightClass="row-highlight-bronze";
      else if(index===3) highlightClass="row-highlight-green";
      else if(index===4) highlightClass="row-highlight-blue";

      const posClass = index===0?"first":index===1?"second":index===2?"third":index===3?"room":index===4?"fifth":"";
      const saldoFloat=parseFloat(item.saldo);
      const saldoFormatado=saldoFloat.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
      const saldoClass=saldoFloat<0?"negative":"positive";

      let statusClass="",statusLabel="";
      if(item.status==="Subiu"){statusClass="status-up";statusLabel="📈 Subiu";}
      else if(item.status==="Desceu"){statusClass="status-down";statusLabel="📉 Desceu";}
      else if(item.status==="Permaneceu"){statusClass="status-same";statusLabel='<span class="status-content"><i data-lucide="equal"></i><span>Estável</span></span>';}
      else{statusClass="status-unknown";statusLabel="❔";}

      tr.innerHTML=`
        <td class="position"><div class="position-indicator ${posClass} ${highlightClass}">${index+1}</div></td>
        <td class="rca">${item.rca}</td>
        <td class="name"><div class="name-info"><span class="full-name">${item.nome}</span></div></td>
        <td class="balance ${saldoClass}">${saldoFormatado}</td>
        <td class="status"><span class="status-badge ${statusClass}">${statusLabel}</span></td>
      `;
      tbody.appendChild(tr);
      createIcons({icons,attrs:{'stroke-width':2}});
    });
  }

  async function loadGrafico(rca){  /*Gráfico do Dia*/
    if(!rca) return;
    try{
      const response = await fetch(`http://192.168.1.102:3006/contacorrente/alteracoes?rca=${rca}`);
      const data = await response.json();
      const labels = data.map(item=>new Date(item.data).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}));
      const dataGrafico = data.map(item=>item.alteracao);

      if(window.linhaGrafico) window.linhaGrafico.destroy();

      // 🔎 pega o nome completo do RCA, filtro do gráfico a partir do originalData
      const rcaInfo = originalData.find(item => item.rca == rca);
      const nomeCompleto = rcaInfo ? rcaInfo.nome : "";
      const saldoAtual = rcaInfo ? rcaInfo.saldo : "";

      window.linhaGrafico = new Chart(ctx,{
        type:'line',
        data: {
          labels,
          datasets: [{
          label: `Alterações do RCA ${rca} ${nomeCompleto ? " -  " + nomeCompleto : ""} ${saldoAtual ? " = R$ " + Number(saldoAtual).toLocaleString("pt-BR", {minimumFractionDigits: 2}) : ""}`,  
          data: dataGrafico,
          borderColor: 'rgba(75,192,192,1)',
          backgroundColor: 'rgba(75,192,192,0.2)',
          tension: 0.3,
          pointRadius: 5,  /*tamanho da bola na exibição do gráfico*/
          pointHoverRadius: 10,  /*tamanho da bola ao passar o mouse do gráfico*/
          pointHitRadius: 15,

          fill: true,                // 🔹 preenchimento suave
          pointBackgroundColor: "#fff",  // bolinha branca
          pointBorderColor: "#2563eb",   // borda azul elegante
          pointBorderWidth: 2
      }]
    },

         options:{
         responsive:true,
         plugins:{
         legend:{ display:true },
         tooltip:{
         enabled:true,
         callbacks:{
         label:function(context){
          let valor = context.raw;
          return `R$ ${Number(valor).toLocaleString("pt-BR",{minimumFractionDigits:2})}`;
        }
      }
    }
  },
  interaction: {
    mode: "index",  /*legenda do gráfico*/
    intersect: false
  },
  scales:{
    y:{ beginAtZero:false }
  }
}

      });

      
    }catch(error){
      console.error("Erro ao carregar dados do gráfico:",error);
    }
  }


  async function loadGraficoMes(rca){  /*Gráfico do Mês*/
  if(!rca) return;
  try{
    const response = await fetch(`http://192.168.1.102:3006/contacorrente/alteracoes-mes?rca=${rca}`);
    const data = await response.json();
    const labels = data.map(item=>new Date(item.data).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"}));
    const dataGrafico = data.map(item=>item.alteracao);

    if(window.linhaGraficoMes) window.linhaGraficoMes.destroy();

    // 🔎 pega o nome completo do RCA, filtro do gráfico a partir do originalData
    const rcaInfo = originalData.find(item => item.rca == rca);
    const nomeCompleto = rcaInfo ? rcaInfo.nome : "";
    const saldoAtual = rcaInfo ? rcaInfo.saldo : "";

    const ctxMes = document.getElementById('graficoLinhaMes').getContext('2d');

    window.linhaGraficoMes = new Chart(ctxMes,{
      type:'line',
      data: {
        labels,
        datasets: [{
          label: `Alterações Mensais RCA`,  /*Texto acima do gráfico do Mês*/
          data: dataGrafico,
          borderColor: 'rgba(0,128,0,1)',
          backgroundColor: 'rgba(0,128,0,0.2)',
          tension: 0.3,
          pointRadius: 5,
          pointHoverRadius: 10,
          pointHitRadius: 15,
          fill: true,
          pointBackgroundColor: "#fff",
          pointBorderColor: "#16a34a",   // verde elegante
          pointBorderWidth: 2
        }]
      },
      options:{
        responsive:true,
        plugins:{
          legend:{ display:true },
          tooltip:{
            enabled:true,
            callbacks:{
              label:function(context){
                let valor = context.raw;
                return `R$ ${Number(valor).toLocaleString("pt-BR",{minimumFractionDigits:2})}`;
              }
            }
          }
        },
        interaction: {
          mode: "index",
          intersect: false
        },
        scales:{
          y:{ beginAtZero:false }
        }
      }
    });

  }catch(error){
    console.error("Erro ao carregar dados do gráfico mensal:",error);
  }
}


});
