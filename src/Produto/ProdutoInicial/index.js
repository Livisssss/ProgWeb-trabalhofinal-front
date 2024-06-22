import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import "./ProdutoInicial.css";

const ProdutoInicial = () => {
  const [produtos, setProdutos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/produto");
        if (!response.ok) {
          throw new Error("Erro ao buscar os produtos do banco de dados.");
        }
        const produtosData = await response.json();
        const sortedProdutos = produtosData.sort((a, b) => a.produto_id - b.produto_id);
        setProdutos(sortedProdutos);
      } catch (error) {
        console.error("Erro ao buscar os produtos:", error);
      }
    };

    fetchProdutos();
  }, []);

  const handleEditClick = async (produtoId) => {
    try {
      if (!produtoId) {
        throw new Error("ID do produto não fornecido.");
      }

      const response = await fetch(`http://localhost:3000/api/v1/produto/${produtoId}`);
      if (!response.ok) {
        throw new Error("Erro ao buscar detalhes do produto.");
      }
      const produtoData = await response.json();

      console.log("Detalhes do produto retornado:", produtoData.nome);
      console.log("ID:", produtoId);

      navigate("/editaProduto", { state: { produtoData, produtoId } });
    } catch (error) {
      console.error("Erro ao buscar os detalhes do produto:", error);
    }
  };

  return (
    <div className="content">
      <Header />
      <h2>PRODUTOS</h2>
      <div className="table-produto-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>NOME</th>
              <th>DESCRIÇÃO</th>
              <th>QUANTIDADE</th>
              <th>PREÇO</th>
              <th>OBSERVAÇÃO</th>
              <th>EDITAR</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto, index) => (
              <tr key={index}>
                <td>{produto.produto_id}</td>
                <td>{produto.nome}</td>
                <td>{produto.descricao}</td>
                <td>{produto.quantidade}</td>
                <td>{produto.preco}</td>
                <td>{produto.observacao}</td>
                <td>
                  <button className="editar-button" onClick={() => handleEditClick(produto.produto_id)}>
                    <img src="/editar.png" alt="Editar" />                  
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="btNovo">
        <Link to="/cadastroProduto">
          <button>+</button>
        </Link>
      </div>
    </div>
  );
};

export default ProdutoInicial;
