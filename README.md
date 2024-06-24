# Projeto de CRUD de Produtos e Fornecedores

Este projeto foi desenvolvido como trabalho final para a matéria de Programação Web. Consiste em um CRUD simples de Produtos e Fornecedores. As tecnologias utilizadas no frontend foram o framework React, utilizando JSX e CSS para personalização dos componentes, e JavaScript para configurações de interação do usuário.

## Configurações do projeto

Após baixar este projeto, seja pelo arquivo .zip ou utilizando o comando git clone na pasta desejada, siga as instruções abaixo para configurá-lo e executá-lo:

### Passo 1: Configuração da API
1. Abra o projeto da API no Visual Studio Code como administrador.
2. Certifique-se de que a API esteja rodando. Normalmente, ela rodará na porta 3000.

### Passo 2: Configuração do Frontend
1. Abra uma nova janela do Visual Studio Code (File -> New Window).
2. Abra o projeto do frontend nesta nova janela.
3. No terminal do VSCode, navegue até a pasta do projeto frontend e execute o comando:

```
npm install
```

Este comando instalará todas as dependências necessárias para rodar o projeto.

### Passo 3: Iniciar o Frontend
1. Com a API já rodando na outra janela do VSCode, execute o seguinte comando no terminal da pasta do frontend:

```
npm start
```

2. Como a porta 3000 já está sendo ocupada pela API, o projeto solicitará para rodar na próxima porta disponível, que normalmente é a 3001.
3. Abra [localhost:3001](http://localhost:3001) no seu navegador para ver a aplicação em funcionamento.
A página recarregará automaticamente sempre que você fizer alterações no código. Você também poderá ver quaisquer erros de lint no console.

