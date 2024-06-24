import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import "./FornecedorInicial.css";

const FornecedorInicial = () => {
  const [fornecedores, setFornecedores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFornecedores = async () => {
      try {
        let url = "http://localhost:3000/api/v1/fornecedor";
        if (searchTerm.trim() !== "") {
          url += `?search=${encodeURIComponent(searchTerm)}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Erro ao buscar os fornecedores do banco de dados.");
        }
        const fornecedoresData = await response.json();
        fornecedoresData.sort((a, b) => a.fornecedor_id - b.fornecedor_id);
        setFornecedores(fornecedoresData);
      } catch (error) {
        console.error("Erro ao buscar os fornecedores:", error);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchFornecedores();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleEditClick = (fornecedor) => {
    navigate("/editaFornecedor", { state: { fornecedorData: fornecedor } });
  };

  return (
    <div className="content-fornecedor">
      <Header />
      <div className="body">
        <h2>FORNECEDORES</h2>
        <div className="search-container-fornecedor">
          <input
            className="input-busca-fornecedor"
            type="text"
            placeholder="Buscar por nome ou CNPJ"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="table-fornecedor-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>NOME</th>
                <th>CNPJ</th>
                <th>ENDEREÇO</th>
                <th>TELEFONE</th>
                <th>E-MAIL</th>
                <th>EDITAR</th>
              </tr>
            </thead>
            <tbody>
              {fornecedores.map((fornecedor) => (
                <tr key={fornecedor.fornecedor_id}>
                  <td>{fornecedor.fornecedor_id}</td>
                  <td>{fornecedor.nome}</td>
                  <td>{fornecedor.cnpj}</td>
                  <td>{fornecedor.endereco}</td>
                  <td>{fornecedor.telefone}</td>
                  <td>{fornecedor.email}</td>
                  <td>
                    <button
                      className="editar-button-table"
                      onClick={() => handleEditClick(fornecedor)}
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
      <div className="btNovo">
        <Link to="/cadastroFornecedor">
          <button>+</button>
        </Link>
      </div>
    </div>
  );
};

export default FornecedorInicial;
