import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import { useLocation } from "react-router-dom";
import "./CadastroProduto.css";
import { NumericFormat } from "react-number-format";

const CadastroProduto = () => {
  const location = useLocation();
  const { produtoData } = location.state || {};

  const [nome, setNome] = useState(produtoData ? produtoData.nome : "");
  const [descricao, setDescricao] = useState(
    produtoData ? produtoData.descricao : ""
  );
  const [quantidade, setQuantidade] = useState(
    produtoData ? produtoData.quantidade : ""
  );
  const [preco, setPreco] = useState(produtoData ? produtoData.preco : "");
  const [observacao, setObservacao] = useState(
    produtoData ? produtoData.observacao : ""
  );
  const [fornecedorId, setFornecedorId] = useState(
    produtoData ? produtoData.fornecedor_id : ""
  );
  const [fornecedores, setFornecedores] = useState([]);

  useEffect(() => {
    if (produtoData) {
      setNome(produtoData.nome);
      setDescricao(produtoData.descricao);
      setQuantidade(produtoData.quantidade);
      setPreco(produtoData.preco);
      setObservacao(produtoData.observacao);
      setFornecedorId(produtoData.fornecedorId);
    }
  }, [produtoData]);

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

  const verificarCamposObrigatorios = () => {
    return nome && descricao && quantidade && preco && fornecedorId;
  };

  // BOTÃO LIMPAR
  const limparCampos = () => {
    setNome("");
    setDescricao("");
    setQuantidade("");
    setPreco("");
    setObservacao("");
    setFornecedorId("");
  };

  // BOTÃO INCLUIR
  const incluirProduto = async () => {
    if (!verificarCamposObrigatorios()) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const produto = {
      nome,
      descricao,
      quantidade,
      preco,
      observacao,
      fornecedor_id: fornecedorId,
    };

    try {
      const response = await fetch("http://localhost:3000/api/v1/produto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(produto),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Produto incluído com sucesso!");
        limparCampos();
      } else if (response.status === 422) {
        console.error("Erro de validação:", result);
        alert("Erro ao incluir produto. Verifique os dados e tente novamente.");
      } else if (response.status === 500) {
        console.error("Erro inesperado:", result);
        alert("Erro ao incluir produto. Tente novamente.");
      } else {
        console.error("Erro inesperado:", result);
        alert("Erro ao incluir produto. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao incluir produto:", error);
      alert("Erro ao incluir produto. Tente novamente.");
    }
  };

  return (
    <div className="content-produtocadastro">
      <Header />
      <h2>PRODUTOS</h2>
      <div className="formulario-produtocadastro">
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
      <div className="botoes-crud-produtocadastro">
        <div className="botoes-esquerda">
          <button
            type="button"
            name="btIncluir"
            id="btIncluir"
            onClick={incluirProduto}
          >
            INCLUIR
          </button>
        </div>
        <div className="botoes-direita">
          <button
            type="button"
            name="btLimpar"
            id="btLimpar"
            onClick={limparCampos}
          >
            LIMPAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default CadastroProduto;
