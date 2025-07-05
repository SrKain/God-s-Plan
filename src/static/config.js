// Notion API Configuration
// Para usar com sua própria base de dados do Notion, atualize as configurações abaixo

const NotionConfig = {
    // Seu token de integração do Notion
    token: 'ntn_v799322124936RT7TDOlQWnRmhMKWb2BOdU1AAu5Fbr7BT',
    
    // ID da sua base de dados do Notion
    databaseId: '2181dc6ee08180d0a2d8ca2fc4a8dd61',
    
    // Mapeamento das propriedades da base de dados
    // Ajuste conforme os nomes das colunas na sua base de dados do Notion
    properties: {
        creator: 'creator',    // Nome da coluna do criador
        description: 'desc',   // Nome da coluna da descrição
        date: 'date',         // Nome da coluna da data
        value: 'value'        // Nome da coluna do valor
    }
};

// Instruções para configuração:
/*
1. Crie uma integração no Notion (https://www.notion.so/my-integrations)
2. Copie o token de integração e cole acima
3. Crie uma base de dados no Notion com as seguintes colunas:
   - creator (Texto)
   - desc (Texto)
   - date (Data)
   - value (Número)
4. Compartilhe a base de dados com sua integração
5. Copie o ID da base de dados da URL e configure abaixo
6. Ajuste os nomes das propriedades se necessário

Para obter o ID da base de dados:
- Abra a base de dados no Notion
- Copie a URL (ex: https://notion.so/workspace/abc123def456...)
- O ID é a parte após o último "/" e antes do "?"
*/

// Função para atualizar a configuração
function updateConfig(databaseId, propertyMappings = {}) {
    NotionConfig.databaseId = databaseId;
    
    // Atualizar mapeamento de propriedades se fornecido
    if (propertyMappings.creator) NotionConfig.properties.creator = propertyMappings.creator;
    if (propertyMappings.description) NotionConfig.properties.description = propertyMappings.description;
    if (propertyMappings.date) NotionConfig.properties.date = propertyMappings.date;
    if (propertyMappings.value) NotionConfig.properties.value = propertyMappings.value;
    
    // Atualizar a aplicação principal
    if (typeof updateNotionConfig === 'function') {
        updateNotionConfig(databaseId);
    }
}

// Exportar configuração
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotionConfig;
} else {
    window.NotionConfig = NotionConfig;
    window.updateConfig = updateConfig;
}

