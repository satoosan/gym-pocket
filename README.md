# Gym Pocket

Webapp/PWA pessoal para acompanhar treinos e evolução corporal.

## Recursos da primeira versão

- Mobile-first e instalável como PWA
- Criação e edição de treinos
- Dias da semana por treino
- Exercícios, séries, repetições e carga
- Registro de sessão concluída
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
