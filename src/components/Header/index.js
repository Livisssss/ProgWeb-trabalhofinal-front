import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <div className="header-container">
      <header className="header">
        <h1>CADASTROS DE FORNECEDORES E PRODUTOS</h1>
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
};
export default Header;
