# 🏋️ Gym Pocket

<p align="center">
  <strong>Seu treino. Seu progresso. Seus dados.</strong>
</p>

<p align="center">
  Uma PWA mobile-first para organizar treinos, registrar cargas, acompanhar recordes pessoais e monitorar a evolução corporal diretamente pelo celular.
</p>

---

## 📱 Sobre o projeto

O **Gym Pocket** é um projeto pessoal criado para centralizar o acompanhamento da rotina de academia em um único lugar.

A ideia surgiu de uma necessidade simples:

> Por que espalhar treinos, cargas, peso, medidas e evolução corporal entre anotações e planilhas se tudo pode ficar em um único aplicativo?

A partir disso nasceu o Gym Pocket.

O projeto foi desenvolvido como uma **Progressive Web App (PWA)**, priorizando principalmente a utilização em smartphones.

Com ele é possível:

* 🏋️ Criar fichas de treino
* 📆 Definir dias da semana
* 💪 Cadastrar exercícios
* 🔢 Registrar séries e repetições
* ⚖️ Registrar cargas
* ⏱️ Controlar o descanso
* 🏆 Acompanhar PRs
* 📅 Consultar o histórico
* 📊 Visualizar evolução
* ⚖️ Registrar peso corporal
* 🧬 Registrar bioimpedância
* 📏 Registrar medidas
* 🧮 Estimar composição corporal
* 💾 Exportar e restaurar backups

Tudo isso sem exigir servidor, assinatura ou banco de dados externo.

---

# ✨ Principais funcionalidades

## 🏋️ Criação de treinos

O Gym Pocket permite criar diferentes fichas de acordo com a rotina do usuário.

Exemplos:

```text
Push
Pull
Legs

Upper
Lower

Peito + Tríceps
Costas + Bíceps
Pernas
```

Cada ficha possui:

* Nome
* Dias da semana
* Exercícios
* Quantidade de séries
* Faixa de repetições
* Carga sugerida

---

# ✅ Validação das fichas

Antes de permitir o salvamento de um treino, o Gym Pocket verifica se as informações essenciais foram preenchidas.

São obrigatórios:

* Nome do treino
* Pelo menos um exercício válido

Caso algum desses requisitos esteja faltando, uma mensagem em vermelho é exibida no topo do formulário.

Exemplo:

```text
Não foi possível salvar:

• Informe o nome do treino.
• Adicione pelo menos um exercício ao treino.
```

O treino somente é salvo depois que os problemas forem corrigidos.

---

# 📆 Organização por dias da semana

Cada treino pode ser associado a um ou mais dias.

Por exemplo:

```text
Treino A
Segunda
Sexta
```

Nesse caso, o treino será apresentado na página inicial apenas na **segunda-feira e sexta-feira**.

O Gym Pocket respeita exatamente os dias configurados na ficha.

---

## Vários treinos no mesmo dia

Também é possível cadastrar mais de uma ficha para o mesmo dia.

Exemplo:

```text
SEGUNDA

Treino A
Peito + Tríceps

Treino B
Cardio

Treino C
Abdômen
```

Todos os treinos programados são exibidos separadamente na tela inicial.

Cada um possui seu próprio botão:

```text
INICIAR TREINO
```

---

# 📅 Visão semanal

A página inicial possui uma visualização rápida da semana.

Ela permite identificar:

* Dias com treino planejado
* Quantidade de treinos planejados
* Dias em que houve treino
* Dia atual

Exemplo:

```text
SEG  TER  QUA  QUI  SEX  SAB  DOM

 ✓    •    2    •    ○    •    •
```

A tela também apresenta a quantidade de treinos realizados durante o mês.

---

# 💪 Exercícios

Cada ficha pode possuir diversos exercícios.

Para cada exercício é possível configurar:

* Nome
* Quantidade de séries
* Repetições
* Carga sugerida

Exemplo:

```text
Supino Reto

3 séries
8–12 repetições
Carga sugerida: 70 kg
```

---

# 🔥 Execução do treino

Ao iniciar uma ficha, o Gym Pocket entra no modo de execução.

Cada série possui campos independentes.

Exemplo:

```text
Supino Reto

Série     Peso      Reps

1         70 kg      10      ✓
2         70 kg       9      ✓
3         70 kg       8      ✓
```

É possível registrar:

* Peso
* Repetições
* Conclusão da série

O aplicativo também utiliza informações anteriores como referência para facilitar a progressão.

---

# 💾 Treino em andamento

O Gym Pocket salva automaticamente o estado do treino atual.

Isso significa que informações como:

* Séries concluídas
* Checks
* Peso
* Repetições

não desaparecem simplesmente ao fechar a tela.

Por exemplo:

```text
Supino

✓ Série 1
✓ Série 2
○ Série 3
```

Caso o usuário saia da execução e retorne posteriormente, o treino continua no estado anterior.

Também existe a opção:

```text
SALVAR E CONTINUAR DEPOIS
```

---

## 🗑️ Descartar treino

Caso não queira continuar uma sessão iniciada, existe a opção:

```text
DESCARTAR TREINO EM ANDAMENTO
```

Uma confirmação é solicitada antes da exclusão.

---

# ⏱️ Cronômetro de descanso

Durante a execução existe um cronômetro integrado.

O tempo inicial padrão é:

```text
01:30
```

Ao concluir uma série, o cronômetro começa automaticamente.

Também existem controles:

```text
-15s
+15s

Iniciar
Parar
```

O tempo pode ser ajustado de acordo com a necessidade.

Quando o descanso termina, dispositivos compatíveis podem utilizar vibração para avisar o usuário.

---

# 🏆 Recordes pessoais — PR

O Gym Pocket possui acompanhamento automático de **Personal Records (PRs)**.

Os recordes são calculados individualmente para cada exercício.

Exemplo:

```text
Supino Reto

PR
80 kg × 8 reps
```

---

## 🔎 Como exercícios são identificados

Os exercícios são comparados através do nome normalizado.

Isso permite reconhecer pequenas diferenças de escrita.

Por exemplo:

```text
Supino Reto
supino reto
SUPINO RETO
```

são reconhecidos como o mesmo exercício.

A normalização também considera diferenças simples relacionadas a espaços e acentuação.

Isso permite que o mesmo exercício participe do mesmo histórico mesmo quando estiver presente em **fichas diferentes**.

---

# 🥇 Como o PR é determinado

O Gym Pocket considera primeiro:

### 1. Maior carga

Exemplo:

```text
70 kg × 12
80 kg × 5
```

O PR será:

```text
80 kg × 5
```

### 2. Maior quantidade de repetições

Caso a carga seja igual:

```text
80 kg × 6
80 kg × 8
```

o melhor resultado será:

```text
80 kg × 8
```

---

# 🔥 Novo PR

Ao concluir uma série que supera o recorde anterior, o Gym Pocket identifica automaticamente o resultado.

O usuário recebe uma mensagem como:

```text
🔥 NOVO PR!

Supino reto
82,5 kg × 8

É ISSO AÍ!
```

O botão da série também recebe uma pequena animação para destacar o momento.

---

# 💪 PR igualado

Nem sempre é necessário superar o recorde para reconhecer um bom resultado.

Caso o usuário repita exatamente o melhor desempenho anterior:

```text
80 kg × 8
```

o aplicativo informa:

```text
💪 PR IGUALADO!

Supino reto
80 kg × 8

Continua assim!
```

---

# 🔍 Lista de PRs

Os recordes podem ser consultados na área:

```text
Progresso
   ↓
PRs por exercício
```

Como um usuário pode possuir dezenas ou até centenas de exercícios, o Gym Pocket evita apresentar uma lista enorme de uma vez.

Inicialmente são mostrados apenas alguns registros.

Existe um botão:

```text
VER TODOS
```

que expande a lista.

Depois:

```text
MOSTRAR MENOS
```

permite recolhê-la novamente.

---

# 🔎 Busca de PR

Também existe um campo de pesquisa.

Exemplo:

```text
Buscar exercício...

supino
```

O aplicativo filtra os PRs instantaneamente.

Isso facilita encontrar um exercício específico mesmo quando existe um histórico grande.

---

# 📅 Histórico

Cada treino finalizado é armazenado.

O histórico registra:

* Data
* Ficha
* Exercícios
* Séries
* Repetições
* Cargas
* Séries concluídas

É possível abrir uma sessão antiga para consultar os detalhes.

---

# 📊 Volume de treino

O Gym Pocket também calcula o volume total realizado.

A fórmula utilizada é:

```text
Volume = Peso × Repetições
```

considerando todas as séries concluídas.

Por exemplo:

```text
5 kg × 8 reps = 40 kg

11 séries iguais:

40 × 11 = 440 kg de volume
```

Portanto:

> **Volume não significa que foram utilizados 440 kg de carga.**

Ele representa a soma do trabalho registrado durante as séries.

Essa informação pode ser útil para acompanhar mudanças na quantidade total de trabalho realizada ao longo do tempo.

Para evolução de força individual, o Gym Pocket utiliza principalmente os **PRs por exercício**.

---

# 🧍 Evolução corporal

Além do treinamento, existe uma área dedicada ao acompanhamento corporal.

É possível registrar:

* Peso
* Percentual de gordura
* Massa muscular
* Água corporal
* Gordura visceral
* Metabolismo basal
* Cintura
* Braço
* Coxa
* Peito
* Observações

Cada avaliação possui sua própria data.

Uma nova avaliação não substitui as anteriores.

---

# 🧬 Bioimpedância

Caso o usuário possua os resultados de uma avaliação realizada por equipamento de bioimpedância, os valores podem ser cadastrados manualmente.

Esses registros são identificados como:

```text
MEDIDO
```

Isso permite separar resultados provenientes de equipamentos das estimativas realizadas pelo aplicativo.

---

# 📐 Estimativa de composição corporal

Caso uma bioimpedância não esteja disponível, o Gym Pocket oferece uma avaliação baseada em medidas corporais.

O fluxo é:

```text
Nova avaliação
      ↓
Estimar pelas medidas
```

São solicitadas informações como:

* Sexo utilizado pela fórmula
* Idade
* Altura
* Peso
* Pescoço
* Cintura/abdômen
* Quadril, quando necessário
* Braço — opcional
* Coxa — opcional
* Peito — opcional

---

# 🧮 Resultados estimados

Com essas informações, o aplicativo pode apresentar:

### IMC

```text
IMC = peso / altura²
```

### Percentual de gordura

Estimativa baseada em circunferências corporais.

### Massa de gordura

```text
Peso × percentual de gordura
```

### Massa livre de gordura

```text
Peso - massa de gordura
```

### Metabolismo basal

Também é apresentada uma estimativa do metabolismo basal.

---

# ⚠️ Sobre as estimativas

Resultados calculados pelo Gym Pocket são identificados como:

```text
ESTIMADO
```

Esses valores são aproximações.

Eles **não devem ser tratados como uma bioimpedância real** e não substituem métodos ou avaliações como:

* Bioimpedância profissional
* DEXA
* Avaliação antropométrica
* Nutricionista
* Médico
* Profissional qualificado

O objetivo principal é acompanhar **tendências ao longo do tempo**.

---

# 📊 Progresso

A área de progresso centraliza informações importantes sobre a evolução.

Atualmente ela possui:

* Evolução do peso
* Evolução da gordura corporal
* Volume dos treinos
* PRs individuais
* Histórico corporal
* Backup e restauração

---

# 📈 Gráficos

O Gym Pocket utiliza a **Canvas API** para gerar gráficos diretamente no navegador.

Entre eles:

### Peso corporal

Permite acompanhar a evolução entre diferentes avaliações.

### Volume dos treinos

Permite acompanhar alterações na quantidade total de trabalho realizado.

A estrutura também permite futuramente adicionar gráficos como:

```text
Carga por exercício
Percentual de gordura
Massa muscular
Cintura
Braço
Frequência
PRs
Volume semanal
```

---

# 💾 Backup completo

Os dados do Gym Pocket podem ser exportados para um arquivo:

```text
.json
```

A opção está disponível em:

```text
Progresso
     ↓
Backup e restauração
     ↓
Exportar backup completo
```

---

# 📦 O que é salvo no backup?

O backup contém os dados necessários para reconstruir o estado do aplicativo.

Entre eles:

### 🏋️ Treinos

* Nome das fichas
* Dias da semana
* Exercícios
* Séries
* Repetições
* Cargas sugeridas

### 📅 Histórico

* Sessões realizadas
* Datas
* Exercícios
* Cargas
* Repetições
* Séries concluídas

### 🏆 PRs

Os PRs **não precisam ser armazenados como valores independentes**.

Eles são reconstruídos automaticamente através do histórico.

Por exemplo:

```text
Histórico

Supino
70 kg × 10

Supino
75 kg × 8

Supino
80 kg × 6
```

Ao importar o backup, o Gym Pocket analisa novamente esses dados e determina:

```text
PR → 80 kg × 6
```

Essa abordagem evita manter informações duplicadas.

---

### 🧍 Evolução corporal

O backup também inclui:

* Peso
* Medidas
* Bioimpedâncias
* Avaliações estimadas
* Histórico corporal

### 🔥 Sessão em andamento

Caso exista um treino ainda não finalizado, seu estado também pode ser preservado.

### ⚙️ Configurações

As configurações utilizadas pelo aplicativo também fazem parte do backup.

---

# 🗃️ Estrutura do backup

Um arquivo exportado possui uma estrutura semelhante a:

```json
{
  "app": "Gym Pocket",
  "backupVersion": 2,
  "exportedAt": "2026-08-14T18:00:00.000Z",
  "summary": {
    "workouts": 3,
    "sessions": 24,
    "bodyAssessments": 4
  },
  "data": {
    "workouts": [],
    "sessions": [],
    "body": [],
    "activeSession": null,
    "settings": {}
  }
}
```

Além dos dados, são armazenadas informações sobre:

* Aplicativo
* Versão do backup
* Data da exportação
* Quantidade de registros

---

# 📥 Importação

Ao selecionar:

```text
Importar backup (.json)
```

o Gym Pocket analisa o arquivo antes de realizar alterações.

É apresentado um resumo.

Exemplo:

```text
Backup encontrado

Treinos                  3
Histórico                24
Avaliações corporais      4
```

Depois o usuário escolhe como deseja realizar a restauração.

---

# 🔀 Mesclar

A opção:

```text
MESCLAR COM DADOS ATUAIS
```

mantém os registros existentes e incorpora as informações do backup.

Isso é útil quando existem informações diferentes em dois conjuntos de dados.

---

# 🔄 Substituir

A opção:

```text
SUBSTITUIR DADOS ATUAIS
```

remove os dados atuais e utiliza somente o conteúdo do backup.

Por segurança, uma confirmação é solicitada antes da operação.

---

# 🔙 Compatibilidade de backups

O sistema também foi preparado para reconhecer arquivos exportados por versões anteriores do Gym Pocket.

Isso facilita a evolução do projeto sem necessariamente abandonar backups antigos.

---

# 🗑️ Zona de reset

O Gym Pocket possui uma área específica para gerenciamento e exclusão dos dados locais.

As opções são separadas para evitar apagar informações desnecessariamente.

---

## 🔄 Resetar progresso e histórico

Remove:

* Histórico dos treinos
* Avaliações corporais
* Peso
* Medidas
* Dados de progresso
* Sessão em andamento

Mantém:

* Fichas
* Exercícios

---

## 🏋️ Resetar fichas

Remove:

* Treinos configurados
* Exercícios das fichas
* Sessão em andamento

Mantém:

* Histórico
* Avaliações
* Medidas

---

## ☢️ Resetar tudo

Remove completamente:

* Treinos
* Exercícios
* Histórico
* PRs derivados
* Peso
* Bioimpedâncias
* Avaliações
* Medidas
* Sessão em andamento
* Configurações locais

Por segurança, essa operação utiliza **dupla confirmação**.

---

# 📲 Progressive Web App

O Gym Pocket foi desenvolvido como uma:

**PWA — Progressive Web App**

Isso permite utilizar tecnologias web mantendo uma experiência próxima de um aplicativo.

Em dispositivos compatíveis, o Gym Pocket pode ser instalado na tela inicial.

Depois disso, pode ser aberto em uma janela própria, sem depender da interface tradicional do navegador.

---

# 📱 Mobile-first

A interface foi desenvolvida pensando primeiro no celular.

Durante um treino, ações importantes precisam exigir poucos toques.

Por isso o projeto prioriza:

* Botões grandes
* Navegação inferior
* Cards
* Alto contraste
* Interface escura
* Inputs acessíveis
* Poucos passos para registrar séries
* Informações importantes visíveis rapidamente

---

# 🌙 Interface

O Gym Pocket utiliza uma interface predominantemente escura com elementos de destaque.

A navegação principal possui:

```text
Hoje
Treinos
Histórico
Corpo
Progresso
```

O objetivo é permitir acesso rápido às áreas mais utilizadas.

---

# 📡 Funcionamento offline

O projeto utiliza **Service Worker** para armazenar recursos essenciais em cache.

Após o primeiro carregamento, arquivos importantes podem continuar disponíveis sem conexão.

O Service Worker também utiliza versionamento de cache.

Quando uma nova versão do Gym Pocket é publicada, caches antigos podem ser removidos para evitar que o navegador continue executando JavaScript ou CSS desatualizado.

---

# 💾 Armazenamento local

Atualmente os dados são mantidos no navegador.

Essa foi uma decisão proposital.

O projeto nasceu com quatro objetivos:

```text
Pessoal
Gratuito
Mobile-first
Sem infraestrutura obrigatória
```

Portanto, atualmente não é necessário:

* Criar conta
* Fazer login
* Manter servidor
* Contratar banco de dados
* Criar API
* Pagar mensalidade
* Manter backend

---

# ⚠️ Importante sobre armazenamento

Como os registros estão no dispositivo/navegador, limpar os dados do site pode resultar na perda das informações.

Por isso é recomendado realizar backups periodicamente.

```text
Progresso
     ↓
Backup e restauração
     ↓
Exportar backup completo
```

---

# 🛠️ Tecnologias

O Gym Pocket foi construído buscando manter a arquitetura simples.

## Front-end

* HTML5
* CSS3
* JavaScript

## APIs e recursos do navegador

* LocalStorage
* Canvas API
* Service Worker
* Web App Manifest
* FileReader API
* Blob API
* Vibration API
* Web Storage API

## Conceitos utilizados

* Progressive Web App
* Mobile-first
* Offline-first
* Responsive Design
* Persistência local
* Versionamento de cache
* Importação/exportação
* Visualização de dados
* Normalização de informações

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

---

## `index.html`

Estrutura principal da interface.

---

## `styles.css`

Responsável por:

* Layout
* Interface mobile
* Cards
* Navegação
* Formulários
* Estados visuais
* Animações
* PRs
* Validações

---

## `app.js`

Contém a maior parte da lógica.

Entre outras responsabilidades:

```text
Treinos
Exercícios
Agenda
Sessões
Persistência
Cronômetro
Histórico
PRs
Bioimpedância
Estimativas
Gráficos
Backup
Importação
Merge
Reset
Validações
```

---

## `manifest.webmanifest`

Define informações necessárias para instalação como PWA.

---

## `sw.js`

Service Worker responsável pelo funcionamento offline e gerenciamento do cache.

---

## `icon.svg`

Ícone utilizado pelo aplicativo.

---

# 🚀 Executando localmente

Clone o repositório:

```bash
git clone URL-DO-SEU-REPOSITORIO
```

Entre na pasta:

```bash
cd gym-pocket
```

Como o projeto utiliza recursos de PWA e Service Worker, é recomendado utilizar um servidor HTTP.

Não utilize apenas:

```text
file://index.html
```

---

## 🐍 Python

Caso tenha Python instalado:

```bash
python -m http.server 8000
```

Depois acesse:

```text
http://localhost:8000
```

---

## 💻 VS Code

Também é possível utilizar uma extensão como:

```text
Live Server
```

Abra a pasta no VS Code e inicie o servidor através da extensão.

---

# 🌐 Hospedagem

Como a versão atual não possui backend obrigatório, pode ser hospedada gratuitamente em serviços de hospedagem estática.

Algumas possibilidades:

* GitHub Pages
* Cloudflare Pages
* Vercel

---

# 🗺️ Roadmap

O projeto continua em desenvolvimento e ainda possui diversas possibilidades de evolução.

---

## 🏋️ Treinos

* [ ] Descanso personalizado por exercício
* [ ] Reordenar exercícios
* [ ] Duplicar fichas
* [ ] Exercícios favoritos
* [ ] Biblioteca de exercícios
* [ ] Grupos musculares
* [ ] Séries de aquecimento
* [ ] Drop sets
* [ ] Supersets
* [ ] RPE
* [ ] RIR
* [ ] Observações por exercício

---

## 🏆 Performance

* [x] PR individual por exercício
* [x] Detecção automática de novo PR
* [x] PR igualado
* [x] Busca de PR
* [x] Lista compacta de recordes
* [ ] Estimativa de 1RM
* [ ] Melhor série histórica
* [ ] Progressão automática de carga
* [ ] Histórico individual completo por exercício
* [ ] Gráfico de força
* [ ] Comparação entre períodos

---

## 📅 Histórico

* [x] Registro de sessões
* [x] Persistência de treino em andamento
* [x] Volume total
* [ ] Calendário mensal completo
* [ ] Sequência de semanas treinadas
* [ ] Frequência mensal
* [ ] Filtro por exercício
* [ ] Filtro por ficha
* [ ] Estatísticas semanais

---

## 🧍 Corpo

* [x] Peso
* [x] Bioimpedância
* [x] Medidas corporais
* [x] Estimativa de composição corporal
* [ ] Comparação detalhada entre avaliações
* [ ] Meta de peso
* [ ] Meta de gordura corporal
* [ ] Fotos de evolução
* [ ] Comparação visual por período
* [ ] Mais medidas corporais

---

## 📊 Dashboard

* [x] Peso
* [x] Volume
* [x] PRs
* [ ] Volume semanal
* [ ] Volume mensal
* [ ] Grupos musculares mais treinados
* [ ] Total de séries
* [ ] Recordes recentes
* [ ] Evolução das medidas
* [ ] Frequência anual

---

## 💾 Dados

* [x] Backup JSON
* [x] Importação
* [x] Mesclagem
* [x] Substituição
* [x] Compatibilidade com backups antigos
* [x] Reset parcial
* [x] Reset completo
* [ ] Exportação CSV
* [ ] IndexedDB
* [ ] Sincronização opcional

---

## ☁️ Futuro

Uma evolução possível seria adicionar sincronização opcional entre dispositivos.

Algumas possibilidades:

* Banco em nuvem
* Autenticação opcional
* Sincronização automática
* Conta pessoal
* Backup remoto

A ideia é que esses recursos continuem sendo **opcionais**, mantendo a possibilidade de utilizar o Gym Pocket completamente local.

---

# 🎯 Filosofia

O Gym Pocket não nasceu inicialmente como um produto comercial.

Ele surgiu para resolver uma necessidade pessoal e acabou se tornando também um projeto para experimentar conceitos de:

* Desenvolvimento Web
* UX/UI
* Mobile-first
* PWA
* Offline-first
* Persistência
* Modelagem de dados
* Visualização de informações
* Evolução incremental de software

A ideia principal continua sendo:

> **Simples o suficiente para usar entre uma série e outra. Completo o suficiente para acompanhar sua evolução.**

---

# 💡 Como começou

Como todo projeto pessoal saudável:

```text
"Vou fazer só uma telinha para anotar meus treinos."
```

Algum tempo depois:

```text
Treinos
Agenda
Histórico
Cronômetro
Bioimpedância
Medidas
Estimativas
Gráficos
PRs
PWA
Offline
Backup
Merge
Reset
Validações...
```

A famosa:

**“Já que estou fazendo, vou colocar só mais uma coisinha.”** 😂

---

# 🔐 Privacidade

Na arquitetura atual, os dados permanecem armazenados localmente no dispositivo do usuário.

O Gym Pocket não exige conta ou envio dos registros para um servidor externo para funcionar.

---

# 🤝 Contribuições

Sugestões e melhorias são bem-vindas.

Caso encontre um problema, fique à vontade para abrir uma **Issue**.

Pull Requests também são bem-vindos.

---

# ⭐ Apoie o projeto

Se você gostou do Gym Pocket, considere deixar uma ⭐ no repositório.

Isso ajuda a acompanhar o interesse pelo projeto e dá aquela motivação para continuar adicionando funcionalidades. 💪

---

# 📄 Licença

O Gym Pocket foi desenvolvido inicialmente para:

* Uso pessoal
* Estudos
* Experimentação
* Portfólio

Consulte o arquivo de licença presente no repositório para informações sobre utilização, modificação e distribuição.

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
