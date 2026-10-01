# ONG Esperança

Plataforma web institucional da ONG Esperança, criada para apresentar a organização e seus projetos e facilitar o cadastro de pessoas interessadas em atuar como voluntárias. A interface prioriza navegação direta, conteúdo semântico e recursos de acessibilidade para diferentes dispositivos.

O projeto adota uma navegação de estilo Single Page Application (SPA): as páginas continuam disponíveis como documentos HTML independentes, mas os links internos são interceptados e o conteúdo de `<main>` é atualizado sem recarregar o documento inteiro. O escopo implementado cobre apresentação institucional, projetos e cadastro de voluntários. Embora a identidade visual preveja cores para chamadas de doação, não há fluxo de doação online nesta versão.

## Tecnologias e Design System

- **HTML5 semântico:** estrutura com elementos como `header`, `nav`, `main`, `section`, `article`, `form` e `footer`; formulários usam atributos nativos de validação e estados acessíveis.
- **CSS3:** estilos responsivos combinam Flexbox para alinhamento de cabeçalho, navegação e formulários com uma estrutura Grid de 12 colunas disponível para composição de layouts. Tokens CSS centralizam cores, tipografia e espaçamentos.
- **JavaScript nativo:** módulos ES6 organizam roteamento, interface, validação e persistência sem framework ou etapa de compilação.
- **SweetAlert2:** notificações de sucesso e erro são carregadas pela CDN jsDelivr. Se a biblioteca não estiver disponível, o formulário mantém mensagens de estado acessíveis na própria página.

O arquivo [css/arch.md](css/arch.md) registra decisões e referências do Design System.

## Pré-requisitos e execução

Não há dependências de build, gerenciador de pacotes ou empacotador. É necessário um navegador atualizado com suporte a módulos ES6 e uma forma de servir os arquivos por HTTP. O servidor estático é necessário porque o roteador carrega as páginas com `fetch`; abrir o HTML diretamente via `file://` não oferece o mesmo funcionamento da navegação SPA.

Uma opção é usar o Python já instalado no ambiente, sem adicioná-lo como dependência do projeto:

1. Abra um terminal na pasta raiz do projeto.
2. Inicie um servidor estático:

	```powershell
	py -m http.server 8000
	```

3. Acesse `http://localhost:8000/pages/index.html` no navegador.

Também é possível usar uma extensão de servidor estático do VS Code. Para testar a navegação entre páginas, mantenha o servidor em execução. A CDN do SweetAlert2 requer conexão com a internet; sem ela, os avisos alternativos do formulário continuam disponíveis.

## Arquitetura modular e roteamento

As responsabilidades estão separadas em módulos pequenos, com a página HTML fornecendo a estrutura e o JavaScript controlando as interações:

| Módulo | Responsabilidade |
| --- | --- |
| `js/main.js` | Inicializa a interface e coordena eventos delegados de navegação, menu responsivo e envio do cadastro. |
| `js/router.js` | Busca o documento de destino com `fetch`, atualiza o histórico com a History API e carrega novamente a rota após eventos `popstate`. |
| `js/ui.js` | Renderiza o conteúdo principal, projetos, histórico local, feedback de validação e notificações. |
| `js/validation.js` | Aplica formatação a CPF, telefone e CEP e interpreta as regras de validade nativas dos campos HTML. |
| `js/storage.js` | Lê e grava o histórico de cadastros no armazenamento local do navegador. |
| `pages/` | Contém os documentos HTML de início, projetos e cadastro de voluntários. |
| `css/style.css` | Define tokens visuais, layout responsivo, estados de interação e estilos dos componentes. |

Ao ativar um link interno marcado com `data-link`, o controlador adiciona a URL ao histórico e solicita o documento de destino. O módulo de interface analisa a resposta, substitui o conteúdo de `<main>`, atualiza o título e o estado do link atual e emite `page:rendered` para que os componentes da página sejam atualizados. Os eventos de voltar e avançar do navegador são tratados por `popstate`. Em caso de falha ao carregar uma rota, a aplicação recorre à navegação convencional.

A validação combina atributos HTML (`required`, `type`, `pattern` e `minlength`) com mensagens específicas e formatação dos campos. O envio inválido direciona o foco ao primeiro campo incorreto; estados e avisos também são expostos por regiões acessíveis (`role="alert"` e `aria-live`).

## Armazenamento e persistência

Os cadastros são armazenados no `localStorage` do navegador sob a chave `voluntarios_ong`. O módulo de persistência converte a lista para JSON com `JSON.stringify` ao gravar e reconstrói os dados com `JSON.parse` ao ler. Cada envio válido inclui os valores do formulário, um protocolo gerado no cliente e a data de envio em formato ISO.

Essa persistência é local ao navegador e ao perfil utilizado: não há API, banco de dados remoto, sincronização entre dispositivos ou envio dos registros para a ONG. Limpar os dados do navegador remove o histórico. Como o formulário coleta informações pessoais, incluindo CPF e contato, esta implementação deve ser tratada como demonstração; `localStorage` não é um mecanismo apropriado para armazenar dados pessoais sensíveis em produção. Um uso real requer backend, controles de acesso, política de retenção e medidas de segurança e privacidade adequadas.

## Estrutura do projeto

```text
.
├── css/
│   ├── arch.md
│   └── style.css
├── img/
├── js/
│   ├── main.js
│   ├── router.js
│   ├── storage.js
│   ├── ui.js
│   └── validation.js
├── pages/
│   ├── cadastro.html
│   ├── index.html
│   └── projetos.html
└── README.md
```
