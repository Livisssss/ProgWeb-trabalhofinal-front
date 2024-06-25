import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import { useLocation } from "react-router-dom";
import "./CadastroFornecedor.css";

const CadastroFornecedor = () => {
  const location = useLocation();
  const { fornecedorData } = location.state || {};

  const [nome, setNome] = useState(fornecedorData ? fornecedorData.nome : "");
  const [cnpj, setCnpj] = useState(fornecedorData ? fornecedorData.cnpj : "");
  const [cep, setCep] = useState(fornecedorData ? fornecedorData.cep : "");
  const [telefone, setTelefone] = useState(
    fornecedorData ? fornecedorData.telefone : ""
  );
  const [endereco, setEndereco] = useState(
    fornecedorData ? fornecedorData.endereco : ""
  );
  const [email, setEmail] = useState(
    fornecedorData ? fornecedorData.email : ""
  );

  useEffect(() => {
    if (fornecedorData) {
      setNome(fornecedorData.nome);
      setCnpj(fornecedorData.cnpj);
      setTelefone(fornecedorData.telefone);
      setEndereco(fornecedorData.endereco);
      setEmail(fornecedorData.email);
    }
  }, [fornecedorData]);

  const handleChangeCnpj = (event) => {
    let value = event.target.value;
    value = cnpjMascara(value);
    setCnpj(value);
  };

  const handleChangeCep = async (event) => {
    let value = event.target.value;
    value = cepMascara(value);
    setCep(value);

    if (value.length === 9) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${value}/json/`);
        const data = await response.json();
        if (data.erro) {
          alert(
            "CEP não encontrado. Por favor, verifique o CEP e tente novamente."
          );
          return;
        }
        setEndereco(
          `${data.logradouro}, ${data.bairro}, ${data.localidade}, ${data.uf}`
        );
        if (data.logradouro === "") {
          setEndereco("");
        }
      } catch (error) {
        console.error("Erro ao buscar dados do CEP:", error);
      }
    }
  };

  const handleChangeTelefone = (event) => {
    let value = event.target.value;
    value = telefoneMascara(value);
    setTelefone(value);
  };

  const verificarCamposObrigatorios = () => {
    return nome && telefone && email && cnpj && endereco;
  };

  // BOTÃO LIMPAR
  const limparCampos = () => {
    setNome("");
    setCnpj("");
    setEndereco("");
    setCep("");
    setTelefone("");
    setEmail("");
  };

  // BOTÃO INCLUIR
  const incluirFornecedor = async () => {
    if (!verificarCamposObrigatorios()) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (!telefone || telefone.length !== 15) {
      alert("Por favor, preencha o telefone corretamente.");
      return;
    }

    const fornecedor = {
      nome,
      cnpj,
      endereco,
      telefone,
      email,
    };

    try {
      const response = await fetch("http://localhost:3000/api/v1/fornecedor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fornecedor),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Fornecedor incluído com sucesso!");
        limparCampos();
      } else if (response.status === 422) {
        console.error("Erro de validação:", result);
        alert(
          "Erro ao incluir fornecedor. Verifique os dados e tente novamente."
        );
      } else if (response.status === 500) {
        console.error("Erro inesperado:", result);
        if (
          result.exception &&
          result.exception.includes("PG::UniqueViolation")
        ) {
          alert("Já existe um fornecedor cadastrado com este CNPJ.");
          setCnpj("");
        } else {
          alert("Erro ao incluir fornecedor. Tente novamente.");
        }
      } else {
        console.error("Erro inesperado:", result);
        alert("Erro ao incluir fornecedor. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao incluir fornecedor:", error);
      alert("Erro ao incluir fornecedor. Tente novamente.");
    }
  };

  return (
    <div className="content-fornecedorcadastro">
      <Header />
      <h2>FORNECEDORES</h2>
      <div className="formulario-fornecedorcadastro">
        <label htmlFor="nome">NOME*</label>
        <input
          type="text"
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          maxLength="60"
        />

        <div className="cnpj-cep-container">
          <div>
            <label htmlFor="cnpj">CNPJ*</label>
            <input
              type="text"
              id="cnpj"
              name="cnpj"
              value={cnpj}
              onChange={handleChangeCnpj}
              maxLength="18"
            />
          </div>
          <div>
            <label htmlFor="cep">
              CEP <span>(consulte o endereço)</span>
            </label>
            <input
              type="text"
              id="cep"
              name="cep"
              value={cep}
              onChange={handleChangeCep}
              maxLength="9"
            />
          </div>
        </div>

        <label htmlFor="endereco">ENDEREÇO*</label>
        <input
          type="text"
          id="endereco"
          name="endereco"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          maxLength="60"
        />

        <div className="contato-container">
          <div>
            <label htmlFor="telefone">TELEFONE*</label>
            <input
              type="text"
              id="telefone"
              name="telefone"
              value={telefone}
              onChange={handleChangeTelefone}
              maxLength="15"
            />
          </div>
          <div>
            <label htmlFor="email">E-MAIL*</label>
            <input
              type="text"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength="60"
            />
          </div>
        </div>
      </div>
      <div className="botoes-crud-fornecedorcadastro">
        <div className="botoes-esquerda">
          <button
            type="button"
            name="btIncluir"
            id="btIncluir"
            onClick={incluirFornecedor}
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

// MÁSCARA PARA CNPJ
export const cnpjMascara = (value) => {
  const formattedValue = value.replace(/\D/g, "");

  return formattedValue
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
};

// MÁSCARA CEP
export const cepMascara = (value) => {
  const formattedValue = value.replace(/\D/g, "");
  return formattedValue.length > 5
    ? formattedValue.replace(/^(\d{5})(\d{1,3})$/, "$1-$2")
    : formattedValue;
};

// MÁSCARA TELEFONE
export const telefoneMascara = (value) => {
  const digitsOnly = value.replace(/\D/g, "");
  if (digitsOnly.length <= 2) {
    return digitsOnly;
  }
  const ddd = digitsOnly.substring(0, 2);
  const prefixo = digitsOnly.substring(2, 3);
  const sufixo1 = digitsOnly.substring(3, 7);
  const sufixo2 = digitsOnly.substring(7);
  let formattedValue = "";
  if (ddd) {
    formattedValue += `(${ddd})`;
  }
  if (prefixo) {
    formattedValue += ` ${prefixo}`;
  }
  if (sufixo1) {
    formattedValue += `${sufixo1}`;
  }
  if (sufixo2) {
    formattedValue += `-${sufixo2}`;
  }
  return formattedValue.trim();
};

export default CadastroFornecedor;
