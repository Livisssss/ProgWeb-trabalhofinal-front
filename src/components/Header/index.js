import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="header-container">
      <header className="header">
        <h1>
          CADASTROS DE FORNECEDORER E PRODUTOS
        </h1>
        <div className="header-buttons">
          <Link className="btNavigate" to="/cadastroFornecedorInicial">
            Fornecedores
          </Link>
          <Link className="btNavigate" to="/cadastroProdutoInicial">
            Produtos
          </Link>
        </div>
      </header>
    </div>
  );
}
export default Header;