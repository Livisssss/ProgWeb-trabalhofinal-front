import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./Home";

import CadastroFornecedorInicial from "./Fornecedor/FornecedorInicial";
import CadastroFornecedor from "./Fornecedor/CadastroFornecedor";
import EditaFornecedor from "./Fornecedor/EditaFornecedor";

import CadastroProdutoInicial from "./Produto/ProdutoInicial";
import CadastroProduto from "./Produto/CadastroProduto";
import EditaProduto from "./Produto/EditaProduto";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Header />} />
        <Route path="/" element={<Home />} />
        <Route path="/cadastroFornecedorInicial" element={<CadastroFornecedorInicial />} />
        <Route path="/cadastroFornecedor" element={<CadastroFornecedor />} />
        <Route path="/editaFornecedor" element={<EditaFornecedor />} />
        <Route path="/cadastroProdutoInicial" element={<CadastroProdutoInicial />} />
        <Route path="/cadastroProduto" element={<CadastroProduto />} />
        <Route path="/editaProduto" element={<EditaProduto />} />
      </Routes>
    </Router>
  );
};

export default App;