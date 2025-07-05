# God's Plan - Landing Page

Uma landing page interativa que integra com a API do Notion para exibir cards de produtos com efeito de iluminação por toque.

## Características

- **Design Responsivo**: Funciona perfeitamente em desktop e mobile
- **Efeito de Iluminação**: A imagem de fundo fica mais clara ao redor do toque/cursor
- **Integração com Notion**: Busca dados diretamente de uma base de dados do Notion
- **Cards de Produto**: Exibe informações como criador, descrição, data e valor
- **Paginação**: Carrega 5 cards por vez com botão "Ver Mais"
- **Valor Total**: Calcula e exibe o valor total de todos os produtos
- **Visual Elegante**: Design escuro com elementos dourados e efeitos visuais

## Estrutura do Projeto

```
gods-plan-lp/
├── index.html          # Estrutura HTML principal
├── styles.css          # Estilos e efeitos visuais
├── script.js           # Lógica JavaScript e integração API
├── config.js           # Configurações da API do Notion
├── README.md           # Este arquivo
└── images/
    ├── background-clovers.jpeg    # Imagem de fundo
    └── fleur-de-lis-gold.png     # Logo flor de lis dourada
```

## Configuração da API do Notion

### 1. Criar uma Integração no Notion

1. Acesse [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Clique em "New integration"
3. Dê um nome para sua integração (ex: "God's Plan API")
4. Selecione o workspace
5. Clique em "Submit"
6. Copie o "Internal Integration Token"

### 2. Criar a Base de Dados no Notion

Crie uma nova base de dados no Notion com as seguintes colunas:

| Nome da Coluna | Tipo     | Descrição                    |
|----------------|----------|------------------------------|
| creator        | Texto    | Nome do criador do produto   |
| desc           | Texto    | Descrição do produto         |
| date           | Data     | Data de criação/publicação   |
| value          | Número   | Valor do produto em reais    |

### 3. Compartilhar a Base de Dados

1. Abra sua base de dados no Notion
2. Clique em "Share" no canto superior direito
3. Clique em "Invite" e procure pelo nome da sua integração
4. Selecione sua integração e clique em "Invite"

### 4. Obter o ID da Base de Dados

1. Abra a base de dados no Notion
2. Copie a URL da página
3. O ID da base de dados é a parte da URL entre a última "/" e o "?"
   
   Exemplo: `https://notion.so/workspace/abc123def456ghi789?v=...`
   
   O ID seria: `abc123def456ghi789`

### 5. Configurar a Landing Page

Abra o arquivo `config.js` e:

1. Substitua o `databaseId` pelo ID da sua base de dados
2. Ajuste os nomes das propriedades se necessário
3. Salve o arquivo

```javascript
const NotionConfig = {
    token: 'seu_token_aqui',
    databaseId: 'seu_database_id_aqui',
    properties: {
        creator: 'creator',
        description: 'desc', 
        date: 'date',
        value: 'value'
    }
};
```

## Como Usar

1. **Configuração**: Siga os passos acima para configurar a API do Notion
2. **Teste Local**: Abra o arquivo `index.html` em um navegador
3. **Deploy**: Faça upload dos arquivos para seu servidor web

## Funcionalidades

### Efeito de Iluminação
- **Desktop**: Mova o cursor sobre a página para ver o efeito
- **Mobile**: Toque e arraste na tela para iluminar a área

### Cards de Produto
- Exibe até 5 cards inicialmente
- Botão "Ver Mais" aparece quando há mais de 5 cards
- Cada card mostra:
  - Nome do criador (topo esquerdo)
  - Valor (topo direito)
  - Descrição (centro)
  - Data (rodapé esquerdo)
  - Botão "Veja no App" (rodapé direito)

### Valor Total
- Calculado automaticamente
- Exibido no topo da página
- Atualizado quando novos dados são carregados

## Personalização

### Cores
Edite o arquivo `styles.css` para alterar as cores:
- `#FFD700`: Cor dourada principal
- `#00FF7F`: Cor verde dos valores
- `#0a0a0a`: Cor de fundo escura

### Imagens
- Substitua `images/background-clovers.jpeg` pela sua imagem de fundo
- Substitua `images/fleur-de-lis-gold.png` pelo seu logo

### Textos
- Altere "God's Plan" no arquivo `index.html`
- Altere "To Life" no rodapé
- Personalize mensagens no arquivo `script.js`

## Solução de Problemas

### Cards não aparecem
1. Verifique se o token da API está correto
2. Confirme se o ID da base de dados está correto
3. Verifique se a base de dados foi compartilhada com a integração
4. Abra o console do navegador (F12) para ver erros

### Efeito de iluminação não funciona
1. Verifique se a imagem de fundo foi carregada
2. Teste em diferentes navegadores
3. Verifique se JavaScript está habilitado

### Problemas de CORS
Se estiver testando localmente, use um servidor web local:
```bash
# Python 3
python -m http.server 8000

# Node.js (se tiver http-server instalado)
npx http-server
```

## Suporte

Para dúvidas ou problemas:
1. Verifique a documentação da API do Notion
2. Consulte o console do navegador para erros
3. Teste com dados de exemplo primeiro

## Tecnologias Utilizadas

- HTML5
- CSS3 (com efeitos avançados)
- JavaScript (ES6+)
- Notion API
- Design Responsivo

