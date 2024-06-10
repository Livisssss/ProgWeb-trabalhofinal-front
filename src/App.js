import React from 'react';
import FornecedorForm from './components/Fornecedor/FornecedorForm';
import ProdutoForm from './components/Produto/ProdutoForm';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Gerenciamento de Fornecedores e Produtos</h1>
      </header>
      <main>
        <FornecedorForm />
        <ProdutoForm />
      </main>
    </div>
  );
}

export default App;
