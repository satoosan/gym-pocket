# 🏋️ Gym Pocket

> Um webapp mobile-first para registrar treinos, acompanhar cargas e visualizar a evolução corporal — simples, pessoal e sem depender de serviços pagos.

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
