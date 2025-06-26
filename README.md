# FullStack-APIs - Frontend

Este repositório contém o código-fonte do front-end da aplicação de busca de filmes, desenvolvida com React e Vite. Ele permite aos usuários pesquisar filmes, visualizar detalhes e gerenciar listas de filmes para assistir ou já assistidos.

## Tecnologias Utilizadas

*   **React 19:** Biblioteca JavaScript para construção de interfaces de usuário.
*   **Vite:** Ferramenta de build rápida para desenvolvimento web moderno.
*   **Axios:** Cliente HTTP baseado em Promises para fazer requisições a APIs.
*   **Lucide React:** Biblioteca de ícones para React.
*   **React Router DOM:** Biblioteca para roteamento declarativo no React.
*   **ESLint:** Ferramenta de linting para identificar e reportar padrões problemáticos encontrados no código JavaScript.

## Configuração do Projeto

Para configurar e executar o projeto em sua máquina local, siga os passos abaixo:

### Pré-requisitos

Certifique-se de ter o Node.js (versão 18 ou superior) e o npm (ou yarn) instalados em sua máquina.

### Instalação

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/ROpeixoto/FullStack-APIs.git frontend
    cd frontend
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Configuração das Variáveis de Ambiente:**

    Crie um arquivo `.env` na raiz do projeto (na mesma pasta de `package.json`) e adicione as seguintes variáveis de ambiente. Você precisará obter suas próprias chaves de API do TMDB e WatchMode.

    ```env
    VITE_TMDB_API_KEY=SUA_CHAVE_API_TMDB
    VITE_WATCHMODE_API_KEY=SUA_CHAVE_API_WATCHMODE
    VITE_API_URL=http://localhost:3000/ # URL do seu back-end
    ```

    *   **`VITE_TMDB_API_KEY`**: Sua chave de API do The Movie Database (TMDB). Você pode obtê-la em [https://www.themoviedb.org/](https://www.themoviedb.org/).
    *   **`VITE_WATCHMODE_API_KEY`**: Sua chave de API do WatchMode. Você pode obtê-la em [https://api.watchmode.com/](https://api.watchmode.com/).
    *   **`VITE_API_URL`**: A URL base do seu back-end. Se estiver executando o back-end localmente na porta 3000, use `http://localhost:3000/`.

## Execução do Projeto

Para iniciar o servidor de desenvolvimento, execute o seguinte comando:

```bash
npm run dev
# ou
yarn dev
```

O aplicativo estará disponível em `http://localhost:5173/` (ou outra porta disponível, conforme indicado pelo Vite).

## Estrutura do Projeto

*   `public/`: Contém arquivos estáticos.
*   `src/`: Contém o código-fonte da aplicação React.
    *   `src/App.jsx`: Componente principal da aplicação, responsável pelo roteamento e gerenciamento de estado global.
    *   `src/main.jsx`: Ponto de entrada da aplicação.
    *   `src/components/`: Contém os componentes reutilizáveis da UI.
    *   `src/utils/`: Contém funções utilitárias e configurações de API.
    *   `src/assets/`: Contém arquivos de mídia e outros recursos.
    *   `src/App.css`: Estilos globais da aplicação.

## Funcionalidades

*   **Busca de Filmes:** Pesquise filmes utilizando a API do TMDB.
*   **Detalhes do Filme:** Visualize informações detalhadas sobre os filmes, incluindo onde assistir (via WatchMode).
*   **Listas Personalizadas:** Adicione filmes às listas "Quero Assistir" e "Assistidos".
*   **Autenticação de Usuário:** Login e registro de usuários para gerenciar suas listas de filmes.

## Contribuição

Sinta-se à vontade para contribuir com melhorias e novas funcionalidades. Por favor, siga as boas práticas de desenvolvimento e crie pull requests para suas alterações.

