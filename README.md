# 🏋️ Gym Pocket

> Um webapp mobile-first para registrar treinos, acompanhar cargas e visualizar a evolução corporal — simples, pessoal e sem depender de serviços pagos.

## 📱 Sobre o projeto

O **Gym Pocket** nasceu de uma ideia simples: criar meu próprio aplicativo para acompanhar meus treinos na academia.

Em vez de utilizar planilhas ou anotações separadas, a proposta é concentrar em um único lugar:

* 🏋️ Treinos
* 🔢 Séries e repetições
* ⚖️ Cargas utilizadas
* 📅 Histórico de treinos
* 📊 Evolução
* ⚖️ Peso corporal
* 📏 Medidas
* 🧬 Bioimpedância
* 🧮 Estimativa de composição corporal

O projeto foi desenvolvido com foco principalmente em **dispositivos móveis** e funciona como uma **PWA (Progressive Web App)**.

Isso significa que pode ser instalado na tela inicial do celular e utilizado de maneira semelhante a um aplicativo.

---

## ✨ Funcionalidades

### 🏋️ Gerenciamento de treinos

Crie diferentes fichas de treino e organize sua rotina.

É possível definir:

* Nome do treino
* Dias da semana
* Exercícios
* Quantidade de séries
* Faixa de repetições
* Carga sugerida

Exemplos:

`Push` • `Pull` • `Legs` • `Upper` • `Lower` • `Full Body`

---

### 🔥 Execução do treino

Durante o treino, o Gym Pocket permite registrar cada série individualmente.

Para cada série:

* Peso utilizado
* Repetições realizadas
* Status de conclusão

Os dados do treino anterior também podem ser utilizados como referência para facilitar a progressão de carga.

---

### 📅 Histórico

Cada treino finalizado fica registrado.

O histórico apresenta informações como:

* Data
* Treino realizado
* Exercícios
* Séries
* Repetições
* Cargas
* Volume total movimentado

---

## 🧍 Evolução corporal

Além dos treinos, o Gym Pocket também permite acompanhar mudanças corporais.

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

Os registros são armazenados por data para permitir o acompanhamento da evolução ao longo do tempo.

---

## 🧬 Bioimpedância

Caso possua uma avaliação de bioimpedância, os resultados podem ser cadastrados diretamente no aplicativo.

As avaliações registradas dessa maneira são identificadas como:

**Medido**

Assim elas podem ser diferenciadas dos valores calculados pelo próprio Gym Pocket.

---

## 📐 Estimativa de composição corporal

Não tem uma balança de bioimpedância disponível?

O Gym Pocket também possui uma avaliação baseada em **medidas corporais**.

O usuário informa dados como:

* Sexo utilizado pela fórmula
* Idade
* Altura
* Peso
* Circunferência do pescoço
* Cintura/abdômen
* Quadril, quando necessário

Com essas informações, o aplicativo consegue gerar estimativas de:

* IMC
* Percentual de gordura corporal
* Massa de gordura
* Massa livre de gordura
* Metabolismo basal

Esses registros são identificados como:

**Estimado**

> ⚠️ Os valores calculados são aproximações baseadas em fórmulas antropométricas e não substituem bioimpedância, DEXA ou avaliação realizada por um profissional.

---

## 📊 Progresso

O dashboard de progresso permite acompanhar visualmente a evolução.

Atualmente estão disponíveis gráficos para:

* ⚖️ Peso corporal
* 🏋️ Volume dos treinos

A estrutura do projeto permite adicionar futuramente gráficos de carga por exercício, percentual de gordura, medidas e outros indicadores.

---

## 💾 Armazenamento

O Gym Pocket foi pensado inicialmente como um projeto **pessoal e gratuito**.

Por isso, os dados são armazenados localmente no navegador.

Não é necessário:

* Servidor
* Banco de dados externo
* Conta
* Login
* Assinatura

### Backup

Para evitar perda dos registros, o aplicativo possui:

**Exportar JSON**

e

**Importar JSON**

Assim é possível manter uma cópia dos dados e restaurá-los posteriormente.

---

## 📲 PWA

O Gym Pocket é uma **Progressive Web App**.

Depois de hospedado, pode ser adicionado à tela inicial de dispositivos compatíveis e utilizado com aparência semelhante à de um aplicativo nativo.

O projeto também possui suporte a cache através de **Service Worker**, permitindo que recursos já carregados continuem disponíveis offline.

---

## 🛠️ Tecnologias

O projeto foi construído buscando simplicidade e facilidade de manutenção.

* HTML5
* CSS3
* JavaScript
* LocalStorage
* Canvas API
* Service Worker
* Web App Manifest
* PWA

Sem frameworks obrigatórios e sem infraestrutura paga.

---

## 🚀 Executando localmente

Clone o repositório:

```bash
git clone URL-DO-REPOSITORIO
```

Entre na pasta:

```bash
cd gym-pocket
```

Como uma PWA utiliza Service Worker, o recomendado é executar o projeto através de um servidor local.

Com Python:

```bash
python -m http.server 8000
```

Depois acesse:

```text
http://localhost:8000
```

Também é possível utilizar extensões como **Live Server** no VS Code.

---

## 📂 Estrutura

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

## 🔮 Próximas ideias

O projeto ainda pode evoluir bastante.

Algumas funcionalidades planejadas/possíveis:

* ⏱️ Cronômetro de descanso
* 🏆 Recordes pessoais (PR)
* 📈 Progressão de carga por exercício
* 📊 Mais gráficos
* 📆 Calendário mensal
* 🧍 Comparação entre avaliações corporais
* 📸 Fotos de evolução
* 🎯 Metas de peso
* ❤️ Exercícios favoritos
* 🔥 Sequência de treinos
* 💪 Grupos musculares trabalhados
* 📱 Melhorias contínuas na experiência mobile
* ☁️ Sincronização opcional entre dispositivos

---

## 🎯 Objetivo

O Gym Pocket não nasceu com a intenção de ser um produto comercial.

É um projeto pessoal criado para resolver uma necessidade que eu tinha no dia a dia e, ao mesmo tempo, explorar desenvolvimento web, PWA, armazenamento local, UX mobile e visualização de dados.

E, como todo bom projeto pessoal:

> começou com **“vou fazer uma coisinha simples”** e provavelmente ainda vai ganhar muita funcionalidade. 😂

---

## 📄 Licença

Projeto destinado principalmente a estudos, experimentação e uso pessoal.

---

⭐ Se você gostou do projeto, considere deixar uma estrela no repositório!
