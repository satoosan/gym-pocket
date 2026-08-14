# Gym Pocket

Webapp/PWA pessoal para acompanhar treinos e evolução corporal.

## Recursos da primeira versão

- Mobile-first e instalável como PWA
- Criação e edição de treinos
- Dias da semana por treino
- Exercícios, séries, repetições e carga
- Registro de sessão concluída
- Cronômetro de descanso automático ao concluir uma série
- Histórico com volume total
- Peso e bioimpedância
- Avaliação estimada por medidas corporais (método de circunferências)
- Medidas corporais
- Gráficos simples de peso e volume
- Backup e restauração em JSON
- Dados salvos localmente no navegador
- Funciona offline após o primeiro carregamento

## Como rodar

Não abra apenas clicando em `index.html`, pois o Service Worker/PWA precisa de servidor local.

Com VS Code, use a extensão Live Server.

Ou com Python:

```bash
python -m http.server 8000
```

Depois abra:

```text
http://localhost:8000
```

## Publicação gratuita

Pode ser hospedado gratuitamente no GitHub Pages, Cloudflare Pages ou Vercel.

## Importante

Os dados ficam no `localStorage` do navegador. Use **Progresso > Exportar JSON** para manter backups.


## Backup completo

O Gym Pocket permite exportar um arquivo `.json` contendo:

- Fichas de treino
- Exercícios
- Séries e cargas
- Histórico de sessões
- Avaliações corporais e medidas
- Configurações do aplicativo

Na importação, é possível escolher entre **mesclar** o backup com os dados atuais ou **substituir** completamente os dados existentes.

Também existem controles independentes para resetar:

- Progresso e histórico
- Fichas de treino
- Todos os dados do aplicativo


## Persistência de treino em andamento

Durante uma sessão, os valores de peso, repetições e o estado de conclusão de cada série são salvos automaticamente. Assim, é possível fechar a tela do treino e continuar depois sem perder os checks.

A tela inicial também respeita exatamente os dias da semana configurados para cada ficha e suporta múltiplos treinos agendados para o mesmo dia.


## Validação de fichas

Ao criar ou editar um treino, o Gym Pocket exige:

- Nome do treino
- Pelo menos um exercício válido

Caso algum campo obrigatório esteja faltando, uma mensagem em vermelho é exibida no topo do formulário antes de permitir o salvamento.


## Recordes pessoais por exercício

O Gym Pocket identifica exercícios recorrentes pelo nome, inclusive quando aparecem em fichas diferentes.

Para cada exercício, o aplicativo registra o melhor desempenho concluído utilizando:

1. Maior carga registrada
2. Em caso de empate na carga, maior número de repetições

Exemplo:

```text
Supino reto
PR: 80 kg × 8 reps
```

Os PRs aparecem durante a execução do treino e também na área de Progresso.

> O volume total do treino continua disponível como estatística e é calculado por `peso × repetições` em todas as séries concluídas.


## PRs compactos e celebração de recordes

A área de recordes pessoais mostra apenas alguns exercícios inicialmente, evitando uma lista enorme. Também possui busca por exercício e botão para expandir ou recolher a lista.

Durante o treino:

- Um PR superado exibe **NOVO PR! É ISSO AÍ 🔥**
- Um PR igualado exibe **PR IGUALADO! Continua assim 💪**
- O botão da série recebe uma animação rápida quando isso acontece


## Biblioteca de exercícios

Os exercícios agora podem ser cadastrados separadamente das fichas de treino.

A biblioteca permite:

- Criar exercícios reutilizáveis
- Definir nome e grupo muscular
- Pesquisar exercícios
- Editar exercícios cadastrados
- Reutilizar o mesmo exercício em diferentes fichas
- Evitar duplicidade de nomes

Ao criar uma ficha, em vez de digitar manualmente o exercício, o usuário abre um seletor com campo de busca e escolhe um item da biblioteca.

Cada exercício possui um identificador interno (`libraryId`). Dessa forma, históricos e PRs conseguem reconhecer o mesmo exercício mesmo quando ele aparece em diferentes fichas.
