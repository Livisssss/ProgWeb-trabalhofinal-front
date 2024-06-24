import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import { NumericFormat } from "react-number-format";
import { useLocation, useNavigate } from "react-router-dom";
import "./editaProduto.css";

const EditaProduto = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { produtoData } = location.state || {};

  const [produtoId, setProdutoId] = useState("");
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [preco, setPreco] = useState("");
  const [observacao, setObservacao] = useState("");
  const [fornecedorId, setFornecedorId] = useState("");
  const [fornecedores, setFornecedores] = useState([]);

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

  useEffect(() => {
    if (produtoData) {
      setProdutoId(produtoData.produto_id || "");
      setNome(produtoData.nome || "");
      setDescricao(produtoData.descricao || "");
      setQuantidade(produtoData.quantidade || "");
      setPreco(produtoData.preco || "");
      setObservacao(produtoData.observacao || "");
      setFornecedorId(produtoData.fornecedor_id || "");
    }
  }, [produtoData]);

  const verificarCamposObrigatorios = () => {
    return nome && descricao && quantidade && preco && fornecedorId;
  };

  // BOTÃO ALTERAR
  const alterarProduto = async () => {
    if (!verificarCamposObrigatorios()) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const produto = {
      produto_id: produtoId,
      nome,
      descricao,
      quantidade,
      preco: preco.toString().replace(",", "."), // Convertendo a vírgula decimal para ponto decimal
      observacao,
      fornecedor_id: fornecedorId,
    };

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/produto/${produtoId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(produto),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Produto alterado com sucesso!");
        navigate("/cadastroProdutoInicial");
      } else {
        if (result.error) {
          alert(result.error);
        } else {
          alert(
            "Erro ao alterar produto. Verifique os dados e tente novamente."
          );
        }
        console.error("Erro ao alterar produto:", result);
      }
    } catch (error) {
      console.error("Erro ao alterar produto:", error);
      alert("Erro ao alterar produto. Tente novamente.");
    }
  };

  // BOTÃO DELETAR
  const deletarProduto = async () => {
    if (!produtoId) {
      alert("ID do produto não encontrado.");
      return;
    }

    if (!window.confirm("Tem certeza que deseja deletar este produto?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/produto/${produtoId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        navigate("/cadastroProdutoInicial");
      } else {
        const result = await response.json();
        if (result.error) {
          alert(result.error);
        } else {
          alert("Erro ao deletar produto. Tente novamente.");
        }
      }
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      alert("Erro ao deletar produto. Tente novamente.");
    }
  };

  return (
    <div className="content">
      <Header />
      <h2>PRODUTOS</h2>
      <div className="formulario">
        <label htmlFor="nome">NOME*</label>
        <input
          type="text"
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          maxLength="60"
        />

        <label htmlFor="descricao">DESCRIÇÃO*</label>
        <input
          type="text"
          id="descricao"
          name="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          maxLength="60"
        />

        <div className="fornecedor">
          <label htmlFor="fornecedorId">FORNECEDOR*</label>
          <select
            id="fornecedor"
            value={fornecedorId}
            onChange={(e) => setFornecedorId(e.target.value)}
          >
            <option value="">Selecione um fornecedor...</option>
            {fornecedores.map((fornecedor) => (
              <option
                key={fornecedor.fornecedor_id}
                value={fornecedor.fornecedor_id}
              >
                {fornecedor.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="quantidade-preco-container">
          <div>
            <label htmlFor="quantidade">QUANTIDADE*</label>
            <input
              type="number"
              id="quantidade"
              name="quantidade"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="preco">PREÇO</label>
            <NumericFormat
              id="preco"
              name="preco"
              value={preco}
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale={true}
              allowNegative={false}
              onValueChange={(values) => setPreco(values.floatValue)}
            />
          </div>
        </div>

        <label htmlFor="observacao">OBSERVAÇÃO</label>
        <input
          type="text"
          id="observacao"
          name="observacao"
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          maxLength="150"
        />
      </div>
      <div className="botoes-crud">
        <div className="botoes-esquerda">
          <button
            type="button"
            name="btIncluir"
            id="btIncluir"
            onClick={alterarProduto}
          >
            ALTERAR
          </button>
        </div>
        <div className="botoes-direita">
          <button
            type="button"
            name="btDeletar"
            id="btDeletar"
            onClick={deletarProduto}
          >
            DELETAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditaProduto;
