# Mann Systems Consulting – site

Site estático (HTML, CSS e JS puros). Sem build, sem dependências.

## Publicar no GitHub Pages
1. Crie um repositório público no GitHub e envie o **conteúdo** desta pasta para a branch `main`.
2. Em **Settings > Pages**, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`.
3. Em alguns minutos o site fica no ar.

## O que você configura (arquivo `js/config.js`)
- `GA_ID`: ID do Google Analytics (formato `G-XXXXXXXXXX`). Vazio = Analytics desligado. Só carrega depois que o visitante aceita os cookies.
- `FORM_ENDPOINT`: endereço de um serviço de formulário (Formspree, Web3Forms). Vazio = o formulário abre o WhatsApp ou o e-mail com a mensagem pronta.
- `SITE`, `WHATSAPP`, `EMAIL`: endereço oficial, número do WhatsApp e e-mail de contato.

## Endereço do site
`index.html`, `404.html`, `privacidade.html`, `termos.html`, `robots.txt` e `sitemap.xml` usam `https://jonnathanproenca.github.io/mannsystems` como endereço oficial.
Se o site ficar em outro endereço (por exemplo `usuario.github.io/repo`), troque esse texto nesses arquivos.

## Conferência rápida
- `/404.html` abre a página de erro personalizada.
- `/robots.txt` e `/sitemap.xml` abrem no navegador.
- Cole o link do site no WhatsApp e veja se a imagem de compartilhamento aparece (pode levar alguns minutos para o WhatsApp atualizar o cache).
