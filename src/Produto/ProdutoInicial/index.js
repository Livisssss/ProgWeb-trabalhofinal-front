import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import "./ProdutoInicial.css";

const ProdutoInicial = () => {
  const [produtos, setProdutos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        let url = "http://localhost:3000/api/v1/produto";
        if (searchTerm.trim() !== "") {
          url += `?search=${encodeURIComponent(searchTerm)}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Erro ao buscar os produtos do banco de dados.");
        }
        const produtosData = await response.json();

        const produtosComFornecedor = await Promise.all(
          produtosData.map(async (produto) => {
            const fornecedorNome = await fetchFornecedorPorId(
              produto.fornecedor_id
            );
            return { ...produto, fornecedor_nome: fornecedorNome };
          })
        );

        const filteredProdutos = produtosComFornecedor.filter(
          (produto) =>
            produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            produto.fornecedor_nome
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        );

        filteredProdutos.sort((a, b) => a.produto_id - b.produto_id);

        setProdutos(filteredProdutos);
      } catch (error) {
        console.error("Erro ao buscar os produtos:", error);
      }
    };

    fetchProdutos();
  }, [searchTerm]);

  const fetchFornecedorPorId = async (fornecedorId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/fornecedor/${fornecedorId}`
      );
      if (!response.ok) {
        throw new Error(`Erro ao buscar o fornecedor com ID ${fornecedorId}.`);
      }
      const fornecedorData = await response.json();
      return fornecedorData.nome;
    } catch (error) {
      console.error("Erro ao buscar o fornecedor:", error);
      return "Desconhecido";
    }
  };

  const handleEditClick = async (produto) => {
    const fornecedorData = await fetchFornecedorPorId(produto.fornecedor_id);
    navigate("/editaProduto", {
      state: { produtoData: produto, fornecedorData },
    });
  };

  const formatPrice = (price) => {
    return `R$ ${price.toFixed(2).replace(".", ",")}`;
  };

  return (
    <div className="content-produtoinicial">
      <Header />
      <div className="body-produtoinicial">
        <h2>PRODUTOS</h2>
        <div className="search-container-produtoinicial">
          <input
            className="input-busca-produto"
            type="text"
            placeholder="Buscar por nome ou fornecedor"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="table-produto-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Quantidade</th>
                <th>Preço</th>
                <th>Observação</th>
                <th>Fornecedor</th>
                <th>Editar</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto) => (
                <tr key={produto.produto_id}>
                  <td>{produto.produto_id}</td>
                  <td>{produto.nome}</td>
                  <td>{`${produto.descricao.slice(0, 25)}...`}</td>
                  <td>{produto.quantidade}</td>
                  <td>{formatPrice(parseFloat(produto.preco))}</td>
                  <td>{produto.observacao}</td>
                  <td>{produto.fornecedor_nome}</td>
                  <td>
                    <button
                      className="editar-button-table"
                      onClick={() => handleEditClick(produto)}
                    >
                      <img src="/editar.png" alt="Editar" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="btNovo-produto">
        <Link to="/cadastroProduto">
          <button>+</button>
        </Link>
      </div>
    </div>
  );
};

export default ProdutoInicial;
