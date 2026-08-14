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


## Seletor de exercícios sem perder a ficha

Ao selecionar ou cadastrar um exercício dentro da edição de uma ficha, o Gym Pocket utiliza uma camada interna sobre o modal atual.

Isso evita que o editor do treino seja fechado ao escolher um exercício. Depois da seleção, o usuário retorna ao mesmo ponto da ficha que estava editando.


## Continuidade ao adicionar exercícios

Ao adicionar ou selecionar um novo exercício dentro de uma ficha, o editor mantém o usuário no card recém-criado.

Depois da seleção, o Gym Pocket rola suavemente até o exercício e posiciona o foco nos campos de séries/repetições, evitando voltar ao topo do formulário.


## Ciclos / programas de treino

É possível agrupar várias fichas em um ciclo de treinamento com duração definida em semanas.

Exemplo:

```text
Hipertrofia — 5 semanas

Push
Pull
Legs
Upper
Lower
```

O progresso semanal é manual. Ao terminar uma semana, o usuário marca o respectivo check no card do ciclo.

O aplicativo apresenta:

- Total de semanas
- Semanas concluídas
- Barra de progresso
- Treinos incluídos
- Checks individuais por semana
- Destaque quando o ciclo é concluído

Um ciclo não altera automaticamente o histórico nem finaliza treinos. Ele funciona como uma camada de organização sobre as fichas existentes.

Ciclos também fazem parte do backup completo em JSON.


## Histórico de ciclos

Quando todas as semanas de um ciclo são marcadas como concluídas, o Gym Pocket:

- Marca o ciclo como finalizado
- Registra a data de conclusão
- Remove o ciclo da lista de ciclos ativos
- Move o registro para o **Histórico de Ciclos**
- Mantém os treinos e sessões normalmente
- Permite reabrir um ciclo finalizado caso necessário

O histórico fica recolhido por padrão para não poluir a tela quando muitos ciclos já tiverem sido concluídos.

O status do ciclo, a data de conclusão e os checks semanais continuam incluídos no backup JSON.


## Nome personalizado do backup

Antes de baixar um backup JSON, o Gym Pocket solicita um nome para o arquivo.

Exemplos:

```text
Treino do Guilherme.json
Hipertrofia - Agosto.json
Backup antes do novo ciclo.json
Gym Pocket - Guilherme.json
```

A extensão `.json` é adicionada automaticamente. Caracteres inválidos para nomes de arquivo são tratados antes do download.


## Busca inteligente, observações e compartilhamento

### Cadastro a partir da busca

Ao pesquisar um exercício que ainda não existe na biblioteca, o Gym Pocket oferece um botão para cadastrá-lo imediatamente usando o texto pesquisado como nome inicial.

### Observações por exercício

Cada exercício dentro de uma ficha possui um campo opcional de observações.

Exemplos:

```text
Banco na posição 3
Controlar a descida
Não travar o cotovelo
Última série até a falha
```

A observação pertence ao exercício daquela ficha e começa vazia ao adicionar um exercício da biblioteca.

### Compartilhar treino no WhatsApp

Os treinos exibidos na tela **Hoje** possuem a opção de compartilhar pelo WhatsApp.

A mensagem inclui:

- Nome do treino
- Exercícios
- Número de séries
- Repetições
- Peso sugerido
- Observações, quando existirem

Os dados continuam armazenados normalmente no backup JSON.


## Compartilhamento nativo

O botão de compartilhamento dos treinos utiliza a **Web Share API** quando disponível.

Em dispositivos compatíveis, isso abre o seletor nativo do sistema, permitindo escolher entre aplicativos instalados, como:

- WhatsApp
- WhatsApp Business
- Telegram
- Mensagens
- E-mail
- Copiar
- Outros aplicativos compatíveis

Caso o navegador não suporte compartilhamento nativo, o Gym Pocket tenta copiar o treino para a área de transferência. Se isso também não estiver disponível, apresenta o texto em uma janela para cópia manual.
