# 🏋️ Gym Pocket

<p align="center">
  <strong>Seu treino. Seu progresso. Seus dados.</strong>
</p>

<p align="center">
  PWA mobile-first para organizar treinos, ciclos, cargas, recordes pessoais, histórico e evolução corporal diretamente pelo celular.
</p>

---

## 📱 Sobre o projeto

O **Gym Pocket** nasceu como um projeto pessoal para substituir anotações espalhadas, planilhas e aplicativos excessivamente complexos por uma solução simples, rápida e focada no uso durante a academia.

A proposta é reunir em um único lugar:

- fichas de treino;
- biblioteca de exercícios;
- séries, repetições e cargas;
- cronômetro de descanso;
- histórico de sessões;
- recordes pessoais;
- ciclos de treinamento;
- peso e medidas corporais;
- bioimpedância;
- estimativas de composição corporal;
- gráficos de progresso;
- backup e restauração.

O projeto foi construído como uma **Progressive Web App (PWA)** e prioriza a experiência em smartphones.

> **Simples o suficiente para usar entre uma série e outra. Completo o suficiente para acompanhar sua evolução.**

---

# ✨ Funcionalidades

## 🏠 Tela Hoje

A tela inicial identifica automaticamente o dia atual e exibe **todos os treinos programados para aquele dia**.

Se houver mais de uma ficha na mesma data, todas são apresentadas separadamente.

Exemplo:

```text
SEGUNDA-FEIRA

Push
Cardio
Abdômen
```

A tela também oferece acesso rápido para iniciar ou compartilhar cada treino.

---

# 🏋️ Fichas de treino

É possível criar quantas fichas forem necessárias.

Cada ficha possui:

- nome;
- dias da semana;
- exercícios;
- séries;
- faixa de repetições;
- peso sugerido;
- observações individuais.

Exemplo:

```text
Push

Segunda
Quinta

Supino reto
4 séries
8-10 reps
80 kg

Desenvolvimento
3 séries
10-12 reps
24 kg
```

O mesmo dia pode possuir **dois ou mais treinos diferentes**.

---

## ✅ Validações

Uma ficha só pode ser salva quando possuir:

- um nome;
- pelo menos um exercício válido.

Caso contrário, o Gym Pocket apresenta uma mensagem de validação antes do salvamento.

---

# ☷ Biblioteca de exercícios

Os exercícios são cadastrados separadamente das fichas.

Na área **Exercícios** é possível:

- cadastrar exercícios;
- pesquisar;
- editar;
- informar grupo muscular;
- excluir exercícios não utilizados;
- reutilizar o mesmo exercício em diferentes fichas.

Exemplo:

```text
Supino reto máquina
Grupo muscular: Peito
```

Ao montar uma ficha, não é necessário redigitar o exercício. Basta tocar em **Selecionar** e pesquisar na biblioteca.

---

## 🔎 Busca inteligente

Ao digitar:

```text
supino
```

o Gym Pocket filtra imediatamente os exercícios relacionados.

Caso a busca não encontre nenhum resultado, o aplicativo oferece:

```text
Cadastrar "Supino inclinado máquina"
```

O texto pesquisado já é utilizado como nome inicial do novo exercício.

Depois de salvar, ele é automaticamente selecionado na ficha.

---

## 🆔 Identificação interna

Cada exercício da biblioteca possui um identificador interno (`libraryId`).

Isso permite que o Gym Pocket entenda que:

```text
Push → Supino reto
Upper → Supino reto
Peito → Supino reto
```

representam o **mesmo exercício**.

Isso melhora a consistência de:

- histórico;
- PRs;
- comparação de desempenho;
- backups;
- fichas diferentes.

Exercícios de versões antigas são migrados para a biblioteca quando possível.

---

# 📝 Observações por exercício

Cada exercício dentro de uma ficha possui um campo opcional de observações.

Exemplos:

```text
Banco na posição 3
Controlar a descida
Não travar o cotovelo
Última série até a falha
Pegada neutra
```

A observação pertence àquele exercício **naquela ficha**.

Ao selecionar um exercício da biblioteca, o campo começa vazio.

Durante a execução do treino, a observação aparece junto ao exercício.

---

# 📆 Dias da semana

Uma ficha pode ser associada a um ou vários dias.

Exemplo:

```text
Treino A
Segunda
Sexta
```

Ele será exibido na tela principal exatamente nesses dias.

Também é possível cadastrar múltiplos treinos para a mesma data.

---

# 🔥 Execução do treino

Ao iniciar uma ficha, o Gym Pocket entra no modo de execução.

Cada série possui campos independentes para:

- carga;
- repetições;
- conclusão.

Exemplo:

```text
Supino reto

Série     Peso     Reps

1         80 kg     10    ✓
2         80 kg      9    ✓
3         80 kg      8    ✓
4         80 kg      7    ○
```

---

# 💾 Persistência do treino em andamento

O estado do treino é salvo localmente.

Se o usuário sair da tela e retornar, permanecem:

- séries marcadas;
- pesos;
- repetições;
- exercício atual;
- dados da sessão.

Também existe a possibilidade de salvar e continuar depois ou descartar a sessão.

---

# 🎯 Continuidade ao adicionar exercícios

Durante a edição de uma ficha, adicionar um exercício não faz o formulário voltar ao topo.

Depois da seleção, o Gym Pocket:

1. retorna ao mesmo card;
2. rola suavemente até o exercício;
3. posiciona o foco nos campos de configuração.

Isso facilita cadastrar várias fichas pelo celular.

---

# ⏱️ Cronômetro de descanso

O Gym Pocket possui cronômetro integrado durante o treino.

O tempo padrão é:

```text
01:30
```

Controles disponíveis:

```text
-15s
+15s
Iniciar
Parar
```

Ao marcar uma série como concluída, o cronômetro pode iniciar automaticamente.

Em dispositivos compatíveis, o término pode utilizar vibração.

---

# 🏆 Recordes pessoais — PR

O Gym Pocket calcula automaticamente os melhores resultados de cada exercício.

A prioridade é:

1. maior carga;
2. em caso de empate, maior quantidade de repetições.

Exemplo:

```text
70 kg × 12
80 kg × 6
80 kg × 8
```

PR:

```text
80 kg × 8
```

---

## 🔥 Novo PR

Quando uma série supera o recorde anterior:

```text
🔥 NOVO PR!

Supino reto
82,5 kg × 8

É ISSO AÍ!
```

O check da série também recebe uma pequena animação.

---

## 💪 PR igualado

Se o melhor resultado for repetido exatamente:

```text
💪 PR IGUALADO!

Supino reto
80 kg × 8

Continua assim!
```

---

## 🔍 Lista compacta de PRs

Para evitar uma tela enorme quando existem muitos exercícios, a área de PRs mostra inicialmente apenas alguns resultados.

É possível:

- buscar um exercício;
- expandir com **Ver todos**;
- recolher com **Mostrar menos**.

Os PRs não precisam ser armazenados separadamente: são reconstruídos a partir do histórico.

---

# 📅 Histórico de treinos

Cada sessão finalizada é armazenada.

O histórico mantém informações como:

- data;
- ficha;
- exercícios;
- séries;
- repetições;
- cargas;
- séries concluídas.

Isso também é utilizado para reconstrução dos PRs.

---

# 📊 Volume de treino

O volume é calculado a partir das séries realizadas:

```text
Volume = carga × repetições
```

Exemplo:

```text
5 kg × 8 reps = 40 kg

11 séries iguais:
40 × 11 = 440 kg de volume
```

O volume representa **trabalho acumulado**, não a carga máxima levantada.

Para acompanhar força individual, o recurso principal são os PRs.

---

# 🔄 Ciclos de treino

Várias fichas podem ser agrupadas em um **ciclo/programa de treinamento**.

Exemplo:

```text
Hipertrofia — 5 semanas

Push
Pull
Legs
Upper
Lower
```

Ao criar um ciclo, o usuário define:

- nome;
- duração em semanas;
- fichas participantes.

---

## ☑️ Progresso semanal manual

Cada semana possui seu próprio check.

Exemplo:

```text
Sem 1 ✓
Sem 2 ✓
Sem 3
Sem 4
Sem 5
```

O Gym Pocket não marca as semanas automaticamente.

Ao terminar uma semana, o próprio usuário confirma sua conclusão.

A barra de progresso é atualizada conforme os checks.

---

# 🏆 Histórico de ciclos

Ao marcar a última semana, o ciclo é finalizado automaticamente.

Ele:

- sai da lista de ciclos ativos;
- recebe a data de conclusão;
- passa para o **Histórico de Ciclos**;
- mantém os treinos originais;
- mantém todas as sessões;
- continua presente no backup.

O histórico fica recolhido para evitar poluir a tela quando muitos ciclos já tiverem sido concluídos.

Um ciclo finalizado também pode ser **reaberto**.

---

# 📤 Compartilhar treino

Na tela **Hoje**, cada ficha possui:

```text
COMPARTILHAR TREINO
```

O Gym Pocket utiliza a **Web Share API** quando disponível.

Isso abre o menu nativo do smartphone, permitindo escolher aplicativos instalados como:

- WhatsApp;
- WhatsApp Business;
- Telegram;
- Mensagens;
- e-mail;
- outros apps compatíveis.

Exemplo de mensagem:

```text
🏋️ Treino de Pernas

📅 Treino: Sex

1. Agachamento livre
   4 séries × 8-10 reps · 80 kg
   📝 Controlar a descida

2. Leg Press
   4 séries × 12 reps · 120 kg

3. Extensora
   3 séries × 15 reps · 40 kg

💪 Gym Pocket
```

Caso o navegador não suporte compartilhamento nativo, o aplicativo tenta copiar o treino para a área de transferência.

Se isso também não estiver disponível, apresenta o texto para cópia manual.

---

# 🧍 Evolução corporal

Além dos treinos, o Gym Pocket possui acompanhamento corporal.

É possível registrar:

- peso;
- percentual de gordura;
- massa muscular;
- água corporal;
- gordura visceral;
- metabolismo basal;
- cintura;
- braço;
- coxa;
- peito;
- observações.

Cada avaliação possui sua própria data e não substitui registros anteriores.

---

# 🧬 Bioimpedância

Resultados obtidos por equipamentos podem ser registrados manualmente.

Esses valores são identificados como:

```text
MEDIDO
```

Isso permite separar medições reais das estimativas calculadas pelo aplicativo.

---

# 📐 Estimativa de composição corporal

Caso não exista uma bioimpedância disponível, o Gym Pocket permite realizar uma estimativa baseada em informações corporais.

Podem ser solicitados:

- sexo utilizado pela fórmula;
- idade;
- altura;
- peso;
- pescoço;
- cintura/abdômen;
- quadril, quando necessário;
- braço;
- coxa;
- peito.

O aplicativo pode estimar:

- IMC;
- percentual de gordura;
- massa de gordura;
- massa livre de gordura;
- metabolismo basal.

Resultados calculados pelo aplicativo são identificados como:

```text
ESTIMADO
```

> As estimativas são aproximações para acompanhamento de tendência e não substituem avaliação profissional, bioimpedância clínica, DEXA ou outros métodos apropriados.

---

# 📈 Progresso e gráficos

A área **Progresso** reúne informações como:

- evolução do peso;
- evolução corporal;
- volume dos treinos;
- PRs;
- backup;
- restauração;
- gerenciamento dos dados.

Os gráficos são renderizados diretamente no navegador através da **Canvas API**.

---

# 💾 Backup completo

O Gym Pocket permite exportar todos os dados para um arquivo JSON.

O backup inclui:

### Biblioteca

- exercícios;
- grupos musculares;
- identificadores internos.

### Fichas

- nomes;
- dias;
- exercícios;
- séries;
- reps;
- cargas;
- observações.

### Ciclos

- nome;
- duração;
- fichas vinculadas;
- semanas concluídas;
- status;
- data de conclusão;
- histórico de ciclos.

### Sessões

- histórico de treinos;
- cargas;
- repetições;
- séries concluídas.

### Corpo

- peso;
- medidas;
- bioimpedâncias;
- avaliações;
- estimativas.

### Estado

- treino em andamento;
- configurações.

Os **PRs são reconstruídos pelo histórico**, evitando duplicidade de dados.

---

# ✏️ Nome personalizado do backup

Antes do download, o Gym Pocket pergunta como o arquivo deve ser chamado.

Exemplos:

```text
Treino do Guilherme.json
Hipertrofia - Agosto.json
Backup antes do novo ciclo.json
Gym Pocket - 2026.json
```

O `.json` é adicionado automaticamente.

Caracteres incompatíveis com nomes de arquivos são tratados antes do download.

---

# 📥 Importação

Ao importar um backup, o Gym Pocket apresenta um resumo do conteúdo encontrado.

Depois existem duas opções.

## 🔀 Mesclar

Mantém os dados atuais e incorpora os dados do arquivo.

## 🔄 Substituir

Remove os dados atuais e restaura somente o conteúdo do backup.

A substituição exige confirmação.

O importador também mantém compatibilidade com estruturas anteriores quando possível.

---

# 🗑️ Reset

A área de gerenciamento permite diferentes níveis de limpeza.

## Resetar progresso

Remove histórico e dados de evolução, preservando fichas.

## Resetar fichas

Remove fichas e estruturas relacionadas.

## Resetar tudo

Apaga completamente os dados locais do Gym Pocket.

Operações destrutivas utilizam confirmações para reduzir exclusões acidentais.

---

# 📲 Progressive Web App

O Gym Pocket é uma **PWA — Progressive Web App**.

Em navegadores e dispositivos compatíveis, pode ser instalado na tela inicial e aberto como um aplicativo independente.

O projeto utiliza:

- Web App Manifest;
- Service Worker;
- cache versionado;
- armazenamento local.

---

# 📡 Funcionamento offline

Recursos essenciais são armazenados em cache pelo Service Worker.

Após o primeiro carregamento, grande parte do aplicativo pode continuar funcionando sem conexão.

A cada versão, o cache recebe um novo identificador para evitar que arquivos JavaScript e CSS antigos continuem sendo utilizados.

---

# 📱 Mobile-first

O Gym Pocket foi desenvolvido pensando primeiro no uso pelo celular.

Durante um treino, a interface prioriza:

- botões grandes;
- poucos toques;
- navegação inferior;
- alto contraste;
- cards;
- campos acessíveis;
- persistência automática;
- retorno ao ponto onde o usuário estava.

---

# 🔐 Privacidade

Na arquitetura atual, os dados ficam armazenados localmente no navegador/dispositivo.

Não é obrigatório:

- criar conta;
- fazer login;
- utilizar servidor;
- contratar banco de dados;
- enviar treinos para uma API externa.

Isso mantém o projeto simples e adequado ao uso pessoal.

> Como os dados são locais, é importante manter backups periódicos. Limpar os dados do navegador pode remover os registros do aplicativo.

---

# 🛠️ Tecnologias

## Front-end

- HTML5
- CSS3
- JavaScript

## APIs do navegador

- LocalStorage
- Canvas API
- Service Worker
- Web App Manifest
- Web Share API
- Clipboard API
- FileReader API
- Blob API
- Vibration API
- Web Storage API

## Conceitos

- Progressive Web App
- Mobile-first
- Offline-first
- Responsive Design
- persistência local
- modelagem de dados
- versionamento de cache
- importação/exportação
- visualização de dados

---

# 📂 Estrutura

```text
gym-pocket/
│
├── index.html
├── styles.css
├── app.js
├── manifest.webmanifest
├── sw.js
├── icon.svg
└── README.md
```

### `index.html`

Estrutura principal da aplicação.

### `styles.css`

Interface, responsividade, animações, cards e estados visuais.

### `app.js`

Lógica de:

- fichas;
- biblioteca;
- execução;
- cronômetro;
- histórico;
- PRs;
- ciclos;
- avaliações;
- gráficos;
- compartilhamento;
- backup;
- importação;
- reset.

### `manifest.webmanifest`

Configurações para instalação da PWA.

### `sw.js`

Cache e funcionamento offline.

---

# 🚀 Executando localmente

Clone o projeto:

```bash
git clone URL-DO-SEU-REPOSITORIO
cd gym-pocket
```

Como existe Service Worker, utilize um servidor HTTP.

Com Python:

```bash
python -m http.server 8000
```

Depois abra:

```text
http://localhost:8000
```

Outra opção é utilizar **Live Server** no VS Code.

Evite abrir diretamente via:

```text
file://
```

---

# 🌐 Hospedagem

Como o projeto não exige backend, pode ser publicado em serviços de hospedagem estática, como:

- GitHub Pages;
- Cloudflare Pages;
- Vercel.

Para instalação completa como PWA e uso de determinadas APIs do navegador, a hospedagem deve utilizar HTTPS — `localhost` é permitido durante desenvolvimento.

---

# 🗺️ Roadmap

## Treinos

- [x] Fichas personalizadas
- [x] Vários treinos no mesmo dia
- [x] Dias da semana
- [x] Biblioteca de exercícios
- [x] Busca de exercícios
- [x] Cadastro a partir da busca
- [x] Observações por exercício
- [x] Persistência de sessão
- [x] Cronômetro
- [x] Compartilhamento nativo
- [ ] Descanso personalizado por exercício
- [ ] Reordenar exercícios
- [ ] Duplicar fichas
- [ ] Séries de aquecimento
- [ ] Supersets
- [ ] Drop sets
- [ ] RPE
- [ ] RIR

## Performance

- [x] PR individual
- [x] Novo PR
- [x] PR igualado
- [x] Busca de PR
- [x] Lista compacta
- [ ] Estimativa de 1RM
- [ ] Histórico detalhado por exercício
- [ ] Gráfico de força
- [ ] Progressão automática de carga

## Ciclos

- [x] Agrupar fichas
- [x] Definir duração
- [x] Check semanal manual
- [x] Barra de progresso
- [x] Finalização automática
- [x] Histórico de ciclos
- [x] Data de conclusão
- [x] Reabrir ciclo
- [ ] Notas por ciclo
- [ ] Comparação entre ciclos

## Corpo

- [x] Peso
- [x] Medidas
- [x] Bioimpedância
- [x] Estimativas
- [ ] Metas corporais
- [ ] Comparação detalhada
- [ ] Fotos de evolução

## Dados

- [x] Backup JSON
- [x] Nome personalizado
- [x] Importação
- [x] Mesclagem
- [x] Substituição
- [x] Reset parcial
- [x] Reset completo
- [ ] Exportação CSV
- [ ] IndexedDB
- [ ] Sincronização opcional em nuvem

---

# 💡 Como começou

Como todo projeto pessoal perfeitamente controlado:

```text
"Vou fazer só uma telinha para anotar meus treinos."
```

Depois vieram:

```text
Treinos
Agenda
Biblioteca
Histórico
Cronômetro
Bioimpedância
Medidas
Estimativas
Gráficos
PRs
Ciclos
PWA
Offline
Backup
Merge
Reset
Compartilhamento...
```

A clássica:

> **“Já que estou fazendo, vou colocar só mais uma coisinha.”** 😂

---

# 🎯 Objetivo

O Gym Pocket não nasceu inicialmente como um produto comercial.

Ele funciona como projeto pessoal e também como laboratório para experimentar conceitos de:

- desenvolvimento web;
- UX/UI;
- PWA;
- persistência;
- modelagem de dados;
- aplicações offline;
- visualização de informações;
- evolução incremental de software.

---

# 🤝 Contribuições

Sugestões, Issues e Pull Requests são bem-vindos.

Se encontrar algum problema ou tiver uma ideia de melhoria, fique à vontade para contribuir.

---

# ⭐ Apoie o projeto

Se o Gym Pocket foi útil ou serviu de inspiração, considere deixar uma ⭐ no repositório.

---

# 📄 Licença

O projeto foi desenvolvido inicialmente para uso pessoal, estudos, experimentação e portfólio.

Consulte o arquivo `LICENSE` do repositório para verificar as condições de utilização, modificação e distribuição.

---

<p align="center">
  <strong>🏋️ GYM POCKET</strong>
</p>

<p align="center">
  Seu treino. Seu progresso. Seus dados.
</p>

<p align="center">
  Desenvolvido com 💻 + ☕ + 🏋️
</p>
