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
