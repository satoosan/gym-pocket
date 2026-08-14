# 🏋️ Gym Pocket

<p align="center">
  <strong>Seu treino. Seu progresso. Seus dados.</strong>
</p>

<p align="center">
  Uma PWA mobile-first para registrar treinos, acompanhar cargas, histórico e evolução corporal diretamente pelo celular.
</p>

---

## 📱 Sobre o projeto

O **Gym Pocket** é um projeto pessoal criado para centralizar o acompanhamento da rotina de academia em um único lugar.

A ideia surgiu de uma necessidade simples:

> Por que espalhar treinos, cargas, peso, medidas e evolução corporal entre anotações e planilhas se tudo pode ficar em um único aplicativo?

A partir disso nasceu o Gym Pocket.

O projeto foi desenvolvido como uma **Progressive Web App (PWA)**, priorizando a experiência em smartphones.

Ele permite criar fichas de treino, registrar cada série realizada, acompanhar cargas anteriores, consultar o histórico, registrar peso e medidas corporais e acompanhar a evolução ao longo do tempo.

Tudo isso sem exigir servidor, assinatura ou banco de dados pago.

---

# ✨ Funcionalidades

## 🏋️ Criação de treinos

Crie suas próprias fichas de acordo com sua rotina.

Cada treino pode possuir:

* Nome personalizado
* Dias da semana
* Quantidade ilimitada de exercícios
* Número de séries
* Faixa de repetições
* Peso/carga sugerida

Exemplos de organização:

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

---

## 💪 Cadastro de exercícios

Cada ficha pode possuir diversos exercícios.

Para cada exercício é possível definir:

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

Cada série possui campos independentes para:

* Peso utilizado
* Repetições realizadas
* Status de conclusão

Exemplo:

```text
Supino Reto

Série 1    70 kg    10 reps    ✓
Série 2    70 kg     9 reps    ✓
Série 3    70 kg     8 reps    ✓
```

O aplicativo também utiliza informações do treino anterior como referência, facilitando o acompanhamento da progressão.

---

# ⏱️ Cronômetro de descanso

Durante a execução do treino existe um cronômetro integrado.

Por padrão:

```text
01:30
```

Ao concluir uma série, o cronômetro é iniciado automaticamente.

Também existem controles para:

```text
-15 segundos
+15 segundos

Iniciar
Parar
```

Quando o descanso termina, dispositivos compatíveis podem utilizar vibração para avisar que está na hora da próxima série.

---

# 📅 Histórico de treinos

Cada treino finalizado é armazenado no histórico.

O registro contém:

* Data
* Ficha utilizada
* Exercícios realizados
* Séries
* Repetições
* Cargas
* Status das séries
* Volume total movimentado

O volume é calculado utilizando:

```text
Volume = Peso × Repetições
```

considerando as séries concluídas.

Isso permite acompanhar não apenas aumento de carga, mas também o volume realizado ao longo do tempo.

---

# 📆 Frequência semanal

A página inicial possui uma visualização dos dias da semana.

Os dias em que houve treino são destacados, permitindo visualizar rapidamente a frequência recente.

Também é exibida a quantidade de treinos realizados no mês.

---

# 🧍 Evolução corporal

O Gym Pocket não acompanha apenas performance na academia.

Existe uma área dedicada à evolução física.

É possível registrar:

* Peso corporal
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

Todos os registros possuem uma data.

Isso significa que uma nova avaliação **não substitui a anterior**.

O histórico é preservado para permitir comparações futuras.

---

# 🧬 Bioimpedância

Caso tenha realizado uma avaliação utilizando uma balança ou equipamento de bioimpedância, os resultados podem ser cadastrados diretamente.

Essas avaliações são identificadas pelo aplicativo como:

```text
MEDIDO
```

Assim é possível diferenciar resultados fornecidos por equipamentos de valores calculados pelo próprio Gym Pocket.

---

# 📐 Estimativa de composição corporal

Nem sempre uma bioimpedância está disponível.

Por isso, o Gym Pocket também possui um modo de **estimativa por medidas corporais**.

Ao selecionar:

```text
Nova avaliação
        ↓
Estimar pelas medidas
```

o aplicativo solicita informações como:

* Sexo utilizado pela fórmula
* Idade
* Altura
* Peso
* Circunferência do pescoço
* Cintura/abdômen
* Quadril, quando necessário
* Braço — opcional
* Coxa — opcional
* Peito — opcional

A partir dessas informações é realizada uma estimativa antropométrica da composição corporal.

O aplicativo pode calcular:

### IMC

```text
IMC = peso / altura²
```

### Percentual estimado de gordura

Calculado através de uma fórmula baseada em circunferências corporais.

### Massa de gordura

```text
Massa de gordura =
Peso × Percentual de gordura
```

### Massa livre de gordura

```text
Massa livre =
Peso - Massa de gordura
```

### Metabolismo basal estimado

Também é apresentada uma estimativa do gasto energético basal.

---

## ⚠️ Importante

As avaliações calculadas pelo Gym Pocket são identificadas como:

```text
ESTIMADO
```

Elas **não são bioimpedâncias reais**.

Os valores são aproximações baseadas em fórmulas antropométricas e não substituem métodos como:

* Bioimpedância
* DEXA
* Avaliação antropométrica profissional
* Acompanhamento médico ou nutricional

O objetivo desse recurso é principalmente permitir o acompanhamento de **tendências ao longo do tempo**.

---

# 📊 Dashboard de progresso

O Gym Pocket possui gráficos para facilitar a visualização da evolução.

Atualmente são apresentados dados como:

### ⚖️ Evolução do peso

Permite visualizar mudanças no peso corporal entre avaliações.

### 🏋️ Volume dos treinos

Mostra como o volume movimentado durante os treinos está evoluindo.

A arquitetura permite adicionar futuramente outros indicadores.

Por exemplo:

```text
Carga por exercício
Percentual de gordura
Massa corporal
Medidas
Frequência
Recordes pessoais
```

---

# 💾 Backup completo

Como os dados são importantes, o Gym Pocket possui um sistema de backup.

É possível selecionar:

```text
Exportar backup completo (.json)
```

O arquivo gerado contém:

* Fichas de treino
* Exercícios
* Séries
* Cargas
* Histórico
* Avaliações corporais
* Medidas
* Configurações

Além dos dados, o arquivo contém informações sobre o próprio backup.

Exemplo da estrutura:

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
    "settings": {}
  }
}
```

Isso facilita futuras atualizações e migrações.

---

# 📥 Importação de backup

Ao importar um arquivo JSON, o Gym Pocket analisa o conteúdo e apresenta um resumo antes da restauração.

Por exemplo:

```text
Backup encontrado

Treinos                  3
Registros no histórico  24
Avaliações corporais     4
```

Depois é possível escolher entre dois modos.

## 🔀 Mesclar

```text
MESCLAR COM DADOS ATUAIS
```

Mantém os dados existentes e incorpora os registros encontrados no backup.

Útil quando existem informações diferentes em dois backups.

---

## 🔄 Substituir

```text
SUBSTITUIR DADOS ATUAIS
```

Remove os dados atuais e restaura o conteúdo presente no arquivo.

Uma confirmação é solicitada antes da operação.

---

## 🔙 Compatibilidade

O sistema de importação também foi pensado para reconhecer backups produzidos por versões anteriores do Gym Pocket.

---

# 🗑️ Zona de reset

O aplicativo possui controles separados para exclusão de dados.

Isso evita precisar apagar tudo quando o objetivo é apenas começar uma nova rotina.

### Resetar progresso e histórico

Remove:

* Histórico dos treinos
* Avaliações corporais
* Peso
* Medidas
* Dados de progresso

Mantém:

* Fichas de treino
* Exercícios

---

### Resetar fichas de treino

Remove:

* Fichas
* Exercícios configurados

Mantém:

* Histórico
* Avaliações
* Medidas corporais

---

### Resetar tudo

Remove todos os dados locais do Gym Pocket.

Por segurança, essa operação exige **dupla confirmação**.

---

# 📲 Progressive Web App

O Gym Pocket foi desenvolvido como uma **PWA — Progressive Web App**.

Isso permite utilizar tecnologias web mantendo uma experiência semelhante à de um aplicativo.

Em dispositivos compatíveis, o Gym Pocket pode ser adicionado à tela inicial.

Depois disso, ele pode ser aberto em uma janela independente, sem a interface tradicional do navegador.

---

# 📡 Funcionamento offline

O projeto utiliza **Service Worker** para armazenar os principais arquivos da aplicação em cache.

Depois do primeiro carregamento, recursos essenciais continuam disponíveis mesmo sem conexão.

O Service Worker também possui controle de versão e limpeza de caches antigos para evitar que atualizações do aplicativo continuem carregando arquivos desatualizados.

---

# 💾 Armazenamento local

Atualmente os dados são armazenados através do armazenamento local do navegador.

Isso foi uma decisão proposital.

O Gym Pocket nasceu como um projeto:

```text
Pessoal
Gratuito
Mobile-first
Sem servidor obrigatório
```

Portanto, atualmente não é necessário:

* Criar conta
* Fazer login
* Manter servidor
* Contratar banco de dados
* Pagar hospedagem de API
* Manter backend

---

## ⚠️ Atenção aos dados locais

Remover os dados do navegador ou desinstalar determinadas configurações da PWA pode resultar na perda dos registros.

Por isso, é recomendado utilizar periodicamente:

```text
Progresso
   ↓
Backup e restauração
   ↓
Exportar backup completo
```

---

# 🛠️ Tecnologias utilizadas

O projeto busca manter uma arquitetura simples.

### Front-end

* HTML5
* CSS3
* JavaScript

### Recursos Web

* LocalStorage
* Canvas API
* Service Worker
* Web App Manifest
* FileReader API
* Blob API
* Vibration API

### Conceitos

* PWA
* Mobile-first
* Offline-first
* Responsive Design
* Persistência local
* Importação e exportação de dados

---

# 📂 Estrutura do projeto

```text
gym-pocket/
│
├── index.html
│
├── styles.css
│
├── app.js
│
├── manifest.webmanifest
│
├── sw.js
│
├── icon.svg
│
└── README.md
```

### `index.html`

Estrutura principal da aplicação.

### `styles.css`

Interface, responsividade, componentes e experiência mobile.

### `app.js`

Responsável pela lógica principal:

```text
Treinos
Histórico
Cronômetro
Avaliações
Cálculos
Gráficos
Backup
Importação
Reset
Persistência
```

### `manifest.webmanifest`

Configurações utilizadas para instalação como PWA.

### `sw.js`

Service Worker responsável por cache e funcionamento offline.

### `icon.svg`

Ícone utilizado pelo aplicativo.

---

# 🚀 Executando o projeto

Clone o repositório:

```bash
git clone URL-DO-SEU-REPOSITORIO
```

Entre no diretório:

```bash
cd gym-pocket
```

Por utilizar recursos de PWA e Service Worker, não é recomendado executar apenas abrindo o `index.html`.

É necessário utilizar um servidor HTTP local.

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

Abra o projeto no VS Code e inicie o servidor através da extensão.

---

# 🌐 Hospedagem

Por ser um projeto totalmente front-end, existem diversas opções gratuitas de hospedagem.

Por exemplo:

```text
GitHub Pages
Cloudflare Pages
Vercel
```

Não é necessário manter uma API ou servidor dedicado para a versão atual.

---

# 🗺️ Roadmap

O Gym Pocket ainda possui bastante espaço para crescer.

## 🏋️ Treinos

* [ ] Descanso personalizado por exercício
* [ ] Reordenar exercícios
* [ ] Duplicar fichas
* [ ] Exercícios favoritos
* [ ] Biblioteca de exercícios
* [ ] Identificação de grupos musculares
* [ ] Séries de aquecimento
* [ ] Drop sets
* [ ] Supersets
* [ ] RPE/RIR

## 📈 Progressão

* [ ] Recordes pessoais (PR)
* [ ] Maior carga por exercício
* [ ] Melhor série
* [ ] Progressão automática de carga
* [ ] Histórico individual de cada exercício
* [ ] Gráfico de força por exercício
* [ ] Comparação entre períodos

## 📅 Histórico

* [ ] Calendário mensal
* [ ] Sequência de dias/semanas treinados
* [ ] Frequência mensal
* [ ] Filtro por exercício
* [ ] Filtro por ficha
* [ ] Estatísticas semanais

## 🧍 Evolução corporal

* [ ] Mais medidas corporais
* [ ] Comparação entre avaliações
* [ ] Metas de peso
* [ ] Meta de percentual de gordura
* [ ] Fotos de evolução
* [ ] Comparação de fotos por período

## 📊 Dashboard

* [ ] Volume semanal
* [ ] Volume mensal
* [ ] Grupos musculares mais treinados
* [ ] Número total de séries
* [ ] Recordes recentes
* [ ] Evolução das medidas

## ☁️ Futuro

* [ ] Sincronização opcional entre dispositivos
* [ ] Banco de dados em nuvem opcional
* [ ] Autenticação opcional
* [ ] Migração do armazenamento local para IndexedDB
* [ ] Importação/exportação em CSV
* [ ] Compartilhamento de fichas

---

# 🎯 Filosofia do projeto

O Gym Pocket não nasceu com o objetivo inicial de ser um produto comercial.

Ele surgiu para resolver uma necessidade pessoal e acabou se tornando também uma oportunidade para experimentar conceitos de:

* Desenvolvimento Web
* UX/UI mobile
* PWA
* Persistência de dados
* Visualização de informações
* Arquitetura offline-first
* Evolução de um projeto real

O objetivo continua sendo manter uma característica importante:

> **ser simples o suficiente para usar durante o treino e completo o suficiente para acompanhar a evolução.**

---

# 💡 Como tudo começou

Como muitos projetos pessoais:

```text
"Vou fazer só uma telinha para anotar meus treinos."
```

Pouco depois:

```text
Treinos
Histórico
Bioimpedância
Estimativas
Gráficos
PWA
Cronômetro
Backup
Importação
Reset...
```

A famosa feature creep. 😂

E ainda tem bastante coisa para implementar.

---

# 🤝 Contribuições

Sugestões, melhorias e ideias são bem-vindas.

Caso encontre algum problema, fique à vontade para abrir uma **Issue**.

Pull Requests também são bem-vindos.

---

# ⭐ Apoie o projeto

Se o Gym Pocket foi interessante para você, considere deixar uma ⭐ no repositório.

Isso ajuda a acompanhar o interesse pelo projeto e também dá aquela moral para continuar adicionando funcionalidades. 💪

---

# 📄 Licença

Projeto desenvolvido inicialmente para **uso pessoal, estudos e experimentação**.

Consulte o arquivo de licença do repositório para informações sobre distribuição e utilização.

---

<p align="center">
  Desenvolvido com 💻 + ☕ + 🏋️
</p>

<p align="center">
  <strong>Gym Pocket</strong><br>
  Seu treino. Seu progresso. Seus dados.
</p>
