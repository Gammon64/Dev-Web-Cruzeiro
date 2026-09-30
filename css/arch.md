# Documentação do Design System - ONG Esperança

Para estruturar a interface da plataforma da ONG Esperança de forma escalável e coerente, foi desenvolvido um Design System baseado em variáveis nativas do CSS (`:root`). Essa arquitetura assegura padronização visual, facilita futuras manutenções e atende diretamente às demandas de usabilidade e acessibilidade do projeto.

Abaixo, apresento a arquitetura das variáveis customizadas:

### 1. Paleta de Cores (Colors)

A paleta foi composta por 8 cores essenciais, distribuídas entre tons institucionais e neutros para garantir legibilidade e contraste adequado:

```css
:root {
  /* Cores Primárias (Identidade e Ação) */
  --color-primary-base: #27AE60; /* Verde institucional, remete à esperança */
  --color-primary-dark: #1E8449; /* Verde escuro para estados de foco/hover (acessibilidade) */
  
  /* Cores Secundárias (Destaque e Alertas) */
  --color-secondary-base: #F39C12; /* Laranja/Amarelo para botões de doação e chamadas de ação */
  --color-secondary-light: #FDEBD0; /* Tom pastel para fundos de seções de destaque */
  
  /* Cores Neutras (Textos e Superfícies) */
  --color-neutral-100: #FFFFFF; /* Branco puro para fundos de leitura */
  --color-neutral-200: #F4F6F7; /* Cinza super claro para distinguir seções de formulários */
  --color-neutral-700: #4F4F4F; /* Cinza escuro para textos secundários e legendas */
  --color-neutral-900: #212121; /* Quase preto para textos principais, garantindo alto contraste */
}

```

### 2. Escala Tipográfica (Typography)

A hierarquia textual foi estruturada em 5 patamares utilizando a unidade relativa `rem`, melhorando a acessibilidade para usuários que alteram o tamanho padrão da fonte no navegador:

```css
:root {
  --font-size-xs: 0.875rem; /* 14px - Utilizado no rodapé (footer) e pequenas legendas */
  --font-size-sm: 1rem;     /* 16px - Base para textos corridos (parágrafos nas sections e articles) */
  --font-size-md: 1.25rem;  /* 20px - Títulos de terceiro nível (h3) para os projetos específicos */
  --font-size-lg: 1.5rem;   /* 24px - Títulos de seções (h2) como "Quem Somos" e "Fale Conosco" */
  --font-size-xl: 2.25rem;  /* 36px - Título principal da página (h1) localizado no header */
}

```

### 3. Espaçamentos Modulares (Spacing)

Foi adotada uma escala rigorosa baseada em múltiplos de 8px (0.5rem), conferindo previsibilidade e consistência ao layout:

```css
:root {
  --spacing-xs: 0.5rem;  /* 8px  - Distância entre labels e inputs no formulário */
  --spacing-sm: 1rem;    /* 16px - Margem interna (padding) de botões de ação */
  --spacing-md: 1.5rem;  /* 24px - Espaçamento entre parágrafos de texto */
  --spacing-lg: 2rem;    /* 32px - Distância entre artigos independentes de projetos solidários */
  --spacing-xl: 4rem;    /* 64px - Margens superiores e inferiores que isolam as tags <section> e <main> */
}

```

### Justificativa e Contexto

A escolha desta arquitetura visual está profundamente alinhada às necessidades do terceiro setor.

* **Acessibilidade digital:** As organizações do terceiro setor frequentemente lidam com públicos diversos, incluindo idosos em aulas de inclusão digital. Garantir um nível adequado de acessibilidade digital para todos os usuários é um requisito essencial. As cores primárias e neutras escolhidas (como o uso da cor `--color-neutral-900` sobre `--color-neutral-100`) asseguram alto contraste, enquanto a escala tipográfica flexível em `rem` promove legibilidade.


* **Carga cognitiva e clareza:** O uso estrito dos espaçamentos modulares ajuda a criar fronteiras visuais rigorosas no documento. Essa organização reduz a carga cognitiva e atua como um mapa de navegação intuitivo para os usuários.


* **Baixo custo de manutenção:** Como muitas ONGs enfrentam limitações orçamentárias e técnicas, centralizar o design em variáveis reutilizáveis viabiliza o desenvolvimento de plataformas digitais profissionais. Uma estruturação clara não compromete a credibilidade institucional e garante que o orçamento reduzido foque no que importa: engajamento e captação de recursos.

## Grid System

### Estrutura do Código: Arquitetura Macroscópica com CSS Grid (12 Colunas)

Para estruturar o layout bidimensional da plataforma da ONG Esperança de forma robusta e adaptável, implementei a propriedade CSS Grid adotando um sistema flexível de 12 colunas. Essa abordagem permite alocar as áreas macrossociais (cabeçalho, conteúdo principal, rodapé) de maneira semântica e escalável.

A arquitetura foi definida no elemento contêiner principal da página, estabelecendo o comportamento do Grid e o espaçamento (`gap`) entre as colunas. Os elementos internos foram configurados para ocupar diferentes proporções dessas 12 colunas, dependendo do espaço disponível na tela.

Abaixo, sintetizo a estrutura base do código desenvolvida:

```css
/* Estrutura base do Grid de 12 colunas */
.grid-container {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 1.5rem; /* Espaçamento modular entre colunas */
    width: 100%;
    max-width: 1440px; /* Limite para telas panorâmicas */
    margin: 0 auto;    /* Centraliza o layout em ecrãs grandes */
    padding: 0 1rem;
}

/* Ocupação padrão (Mobile First) - todos os elementos ocupam 12 colunas integralmente */
.grid-container > * {
    grid-column: span 12;
}

/* Exemplo de distribuição de áreas vitais em telas maiores (Desktop) */
@media (min-width: 1024px) {
    header, footer {
        grid-column: span 12; /* Topo e rodapé continuam ocupando toda a largura */
    }
    
    main { 
        grid-column: span 8; /* Área principal de relevância ocupa 2/3 da tela */
    }

    aside { 
        grid-column: span 4; /* Área secundária (ex: chamadas para doação) ocupa 1/3 */
    }

    /* Distribuição dos cards dos projetos solidários */
    .projeto-card {
        grid-column: span 4; /* Permite exibir 3 cards por linha (12 / 4 = 3) */
    }
}

```

Essa estruturação assegura estabilidade técnica e visual, pois as 12 colunas oferecem múltiplos divisores exatos (1, 2, 3, 4, 6, 12), permitindo a criação de layouts perfeitamente simétricos ou blocos assimétricos. O uso da unidade fracionária (`1fr`) garante que o espaço seja distribuído fluidamente, acomodando o conteúdo sem quebrar o layout, independentemente da resolução da tela.

---

### Pontos de Quebra (Breakpoints) e Estratégia Adaptativa

Para acomodar a variação de visualização nos ecrãs, adotei a estratégia *Mobile First*. O layout inicial empilha os elementos em uma única coluna (span 12), e os cinco pontos de quebra atuam progressivamente à medida que a tela cresce:

1. **480px (Smartphones grandes):** `@media (min-width: 480px)`. Ajusta as margens internas e reduz o agrupamento excessivo de texto, mantendo 1 coluna principal.
2. **768px (Tablets em modo retrato):** `@media (min-width: 768px)`. O grid começa a ser fracionado. Elementos de formulário e cards secundários passam a ocupar 6 colunas (2 itens por linha).
3. **1024px (Laptops e Tablets paisagem):** `@media (min-width: 1024px)`. Ocorre a divisão macrossocial: o `<main>` assume 8 colunas e painéis laterais assumem 4 colunas.
4. **1280px (Desktops padrão):** `@media (min-width: 1280px)`. Projetos solidários passam a exibir 3 cards por linha (`span 4`). O espaçamento modular ganha respiros maiores.
5. **1440px (Ecrãs panorâmicos/Ultrawide):** `@media (min-width: 1440px)`. O layout atinge sua largura máxima (`max-width`), travando as colunas e centralizando o `.grid-container`. Isso evita que as linhas de texto fiquem excessivamente longas, mantendo a carga cognitiva ideal para a leitura.

## Flexbox

| Nome do componente ou contentor | Propriedades Flexbox aplicadas |
| --- | --- |
| Cabeçalho Principal (`<header>`)

 | `display: flex; justify-content: space-between; align-items: center;`. Posiciona o título principal (`<h1>`) da ONG e a barra de navegação em extremidades opostas da tela, mantendo-os centralizados no eixo vertical para uma leitura harmônica.

 |
| Menu de Navegação (`<nav> <ul>`)

 | `display: flex; gap: 1.5rem; flex-wrap: wrap;`. Alinha os links das páginas (Início, Projetos, Cadastro) horizontalmente. O uso do `flex-wrap` assegura que os itens fluam para a linha inferior em ecrãs de smartphones sem transbordar o contentor original.

 |
| Cartões de Iniciativas (`<article class="projeto">`)

 | `display: flex; flex-direction: column; justify-content: space-between; gap: 1rem;`. Estrutura internamente os dados autossuficientes dos projetos solidários. A orientação em coluna empilha os títulos (`<h3>`) e descrições (`<p>`) de forma distribuída.

 |
| Agrupamentos de Cadastro (`<fieldset>`)

 | `display: flex; flex-direction: column; gap: 0.5rem;`. Atua na distribuição microscópica do formulário, garantindo que as etiquetas (`<label>`) fiquem alinhadas verticalmente sobre os seus respectivos campos de entrada (`<input>`).

 |

 Para viabilizar a transformação do componente de navegação em um menu condensado tipo hambúrguer para dispositivos móveis, mantendo a organização da plataforma do terceiro setor delineada no arquivo "Desenvolvimento front-end", adotei uma estratégia CSS baseada em ocultação seletiva, manipulação de estados e transições fluidas. O processo técnico seguiu as seguintes etapas:

**1. Estruturação e Ocultação de Submenus (Resolução Padrão / Desktop)**
Em ecrãs extensos, os links da navegação principal, abrigados na tag `<nav>` e estruturados em uma lista `<ul>`, mantêm o alinhamento horizontal. Para desenvolver a vertente de submenus (dropdown) sem poluir a área principal, utilizei o seletor primário `.dropdown-menu`.
A lógica aplicada para ocultar esses elementos foi retirá-los do fluxo normal com `position: absolute;` e torná-los invisíveis com as propriedades `opacity: 0;` e `visibility: hidden;`.
Para o acionamento responsivo no desktop, apliquei as pseudo-classes `:hover` e `:focus-within` no item pai (`.nav-item`). O código utilizado segue esta estrutura:

```css
.nav-item:hover .dropdown-menu, 
.nav-item:focus-within .dropdown-menu {
    opacity: 1;
    visibility: visible;
    transition: opacity 0.3s ease-in-out;
}

```

Isso assegura que o submenu só apareça mediante a interação do mouse ou foco de teclado, garantindo acessibilidade e preservando o espaço da interface.

**2. Transição para o Menu Hambúrguer (Mobile e Tablets)**
Para economizar área útil em resoluções menores, implementei a regra `@media (max-width: 768px)`. É neste ponto de quebra que a disposição horizontal se transforma em uma estrutura vertical condensada.

* **Acionamento do botão:** O ícone do hambúrguer, controlado pelo seletor `.menu-toggle`, possui `display: none;` na resolução padrão. Dentro da *media query*, ele passa a receber `display: flex;` ou `block;`, tornando-se visível e interativo.
* **Ocultação inicial do menu:** O seletor `.nav-list` (que representa a `<ul>` dos links) muda para `flex-direction: column;` e `position: absolute;`. Para que ele fique escondido inicialmente, apliquei a lógica `transform: translateY(-100%);` e `opacity: 0;`.
* **Lógica de animação e exibição:** A exibição ocorre através de uma classe de estado, como `.is-active` (geralmente adicionada ao `.nav-list` via evento de clique no JavaScript). A transição suave é orquestrada pelas seguintes declarações:

```css
/* Configuração da transição dentro do @media (max-width: 768px) */
.nav-list {
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: transform 0.4s ease-in-out, opacity 0.4s ease;
}

/* Estado acionado ao clicar no ícone hambúrguer */
.nav-list.is-active {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
}

```

Esta arquitetura garante que usuários com diferentes literacias digitais possam explorar as ofertas de voluntariado e os projetos da ONG com clareza, independentemente do dispositivo utilizado. A *media query* atua como uma chave mestre, desmontando a complexidade do desktop para uma navegação de alta usabilidade no mobile.

Para assegurar uma comunicação intuitiva e acessível na plataforma da ONG, o design das interatividades visuais foi estruturado para guiar o usuário de forma clara, eliminando ambiguidades durante a navegação e o preenchimento de formulários. Como a aplicação utiliza validações nativas do HTML5 como primeira camada de defesa para garantir a integridade dos dados, o CSS foi planejado para refletir essas validações e estados de interação em tempo real.

Abaixo, detalho o encadeamento lógico e as modificações de propriedades aplicadas:

### 1. Estados Interativos dos Botões (CTAs)

Os botões de ação (como "Enviar Cadastro" ou botões de doação) foram codificados com transições suaves (`transition: all 0.3s ease;`) para responder instantaneamente aos eventos provocados pelos utilizadores. O encadeamento de pseudo-classes foi definido da seguinte forma:

* **Estado Padrão:** Apresenta a cor de fundo secundária (ex: laranja/amarelo para chamadas de ação), bordas arredondadas e texto contrastante.
* **`:hover` (Foco do Mouse):** A propriedade `background-color` é escurecida (utilizando um tom *dark* da paleta) e adiciona-se uma `box-shadow` suave (`0 4px 8px rgba(0,0,0,0.15)`) para indicar que o elemento é clicável e está flutuando sobre a interface.
* **`:focus` (Navegação por Teclado):** Essencial para a acessibilidade, altera a propriedade `outline` (ex: `3px solid var(--color-primary-base)`) com um `outline-offset: 2px`. Isso cria uma borda externa visível que não quebra o layout, orientando usuários que utilizam a tecla *Tab* ou leitores de tela.
* **`:active` (Clique/Toque):** Modifica a propriedade `transform` para `scale(0.98)` e reduz a `box-shadow`. Isso simula o afundamento físico de um botão real, confirmando o acionamento da ação.
* **`:disabled` (Inativo):** Reduz a `opacity` para `0.6`, altera o `background-color` para cinza e modifica o `cursor` para `not-allowed`. Impede cliques repetidos ou o envio de formulários incompletos.

### 2. Validação Visual nos Campos de Formulário

O formulário de cadastro utiliza atributos nativos, como `required` e `pattern` (para CPF, Telefone e CEP), que bloqueiam informações incorretas no próprio navegador. Para traduzir essa mecânica visualmente e fornecer feedback imediato ao usuário, utilizei as seguintes propriedades:

* **`:focus` (Campo Ativo):** Ao entrar no campo (`<input>` ou `<select>`), a `border-color` assume a cor primária da ONG (verde) e ganha um brilho sutil com `box-shadow`. Isso destaca exatamente onde o usuário está digitando.
* **`:invalid` (Erro de Preenchimento):** Quando o dado inserido não respeita a sintaxe exigida (como um e-mail sem '@' ou um CPF incompleto), a `border-color` muda para vermelho (#E74C3C) e o `background-color` ganha um tom avermelhado muito claro. Isso sinaliza o erro instantaneamente, facilitando a correção de equívocos em tempo real.


* **`:valid` (Preenchimento Correto):** Quando os dados atendem aos requisitos da máscara ou do tipo específico, a `border-color` torna-se verde (#27AE60) e um ícone de "check" pode ser exibido via `background-image` posicionado à direita.



Esse encadeamento lógico no CSS assegura que o sistema dialogue visualmente com o visitante. A validação nativa atrelada ao design responsivo garante que a organização receba registros limpos e padronizados, prontos para suas campanhas de engajamento, sem frustrar o usuário com recarregamentos desnecessários da página.

## Feedbacks

Para consolidar a confiança dos usuários na plataforma da ONG Esperança, o planejamento dos componentes de feedback deve unir clareza visual, semântica impecável e acessibilidade. Conforme o contexto do projeto detalhado no arquivo "Desenvolvimento front-end", as organizações do terceiro setor dependem do engajamento de voluntários e da captação de doações. Assim, o fornecimento de respostas imediatas e claras evita ambiguidades e preserva a credibilidade institucional.

Abaixo, apresento o planejamento estrutural e a aparência final desses recursos, que devem ser padronizados no arquivo `css/style.css` para uso futuro do back-end:

### 1. Alertas (Alerts)

* **Propósito:** Fornecer feedback explícito sobre o sucesso ou falha de uma ação, como o preenchimento incorreto das máscaras de entrada (CPF, CEP ou Telefone) no arquivo `cadastro.html`.


* **Composição Estrutural:** Utilização da tag `<div>` com o atributo `role="alert"` para garantir que leitores de tela anunciem a mensagem imediatamente.


* **Aparência Final:** Caixas retangulares dispostas no topo do formulário. O design utilizará cores semânticas de fundo em tons muito claros (verde-claro para sucesso, vermelho-claro para erro), com bordas espessas à esquerda (na cor primária correspondente) e tipografia escura para garantir alto contraste e acessibilidade. Ícones acompanhados do texto reforçarão a mensagem.

### 2. Notificações Não Obstrutivas (Toasts)

* **Propósito:** Avisos rápidos e efêmeros, ideais para ações secundárias nas Campanhas de Doação, como a notificação de "Chave PIX copiada com sucesso".


* **Composição Estrutural:** Uma lista encapsulada em um contêiner posicionado de forma fixa (`position: fixed`) no canto inferior direito da tela, evitando cobrir informações vitais do `<main>`.


* **Aparência Final:** Blocos flutuantes com sombra projetada suave (`box-shadow`), fundo escuro (tons da cor neutra 900) e texto branco, garantindo a leitura rápida. Terão animações de transição para deslizar para dentro da tela e desaparecer automaticamente após alguns segundos.

### 3. Modais (Caixas de Diálogo)

* **Propósito:** Interromper o fluxo para ações críticas que exigem confirmação do usuário, como os termos finais para se tornar um voluntário.
* **Composição Estrutural:** Uso da tag semântica nativa `<dialog>` do HTML5, estruturada internamente com `<header>`, `<main>` e `<footer>` para organizar o título, o texto e os botões de ação (CTAs).
* **Aparência Final:** O modal será centralizado na tela, com cantos arredondados e fundo branco. O elemento crucial será o uso de um `backdrop` (fundo escurecido e semitransparente) que cobre o restante da interface. Essa técnica reduz a carga cognitiva, focando a atenção inteiramente na tomada de decisão.



### 4. Crachás Semânticos (Badges)

* **Propósito:** Categorizar visualmente informações nos cartões descritivos (tags `<article>`) dentro da página `projetos.html`.


* **Composição Estrutural:** Tags `<span>` inline posicionadas ao lado dos títulos `<h3>` dos projetos solidários.


* **Aparência Final:** Elementos compactos com `border-radius` em formato de pílula, com tamanhos de fonte reduzidos (`font-size-xs`). As cores de fundo devem utilizar os tons secundários da paleta original (ex: laranja/amarelo) para criar pontos de destaque visual sem poluir a leitura do parágrafo descritivo.

O desenvolvimento deste conjunto de estilos centralizado assegura que a equipe de back-end possa acionar interações dinâmicas através da simples adição de classes CSS, mantendo o nível adequado de acessibilidade digital para todos os usuários.