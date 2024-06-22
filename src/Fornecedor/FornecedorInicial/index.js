import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import "./FornecedorInicial.css";

const FornecedorInicial = () => {
  const [fornecedores, setFornecedores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFornecedores = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/fornecedor");
        if (!response.ok) {
          throw new Error("Erro ao buscar os fornecedores do banco de dados.");
        }
        const fornecedoresData = await response.json();
        setFornecedores(fornecedoresData);
      } catch (error) {
        console.error("Erro ao buscar os fornecedores:", error);
      }
    };

    fetchFornecedores();
  }, []);

  const handleEditClick = (fornecedorId) => {
     console.log("ID do fornecedor clicado para editar:", fornecedorId);
    navigate("/editaFornecedor", { state: { fornecedorId } });
  };

  return (
    <div className="content">
      <Header />
      <h2>FORNECEDORES</h2>
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
                  <button className="editar-button" onClick={() => handleEditClick(fornecedor.fornecedor_id)}>
                    <img src="/editar.png" alt="Editar" />  
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
