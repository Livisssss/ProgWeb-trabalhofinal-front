import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import { useLocation } from "react-router-dom";
import "./editaProduto.css";
import { useNavigate } from "react-router-dom";

const EditaProduto = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { fornecedorData, fornecedorId } = location.state || {};

    const [id, setId] = useState("");
    const [telaCadastrosAberta, setTelaCadastrosAberta] = useState("FORNECEDORES");
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [uf, setUf] = useState("");
    const [cep, setCep] = useState("");
    const [telefone, setTelefone] = useState("");
    const [endereco, setEndereco] = useState("");
    const [cidade, setCidade] = useState("");
    const [email, setEmail] = useState("");
    const [tipoPessoa, setTipoPessoa] = useState(null);

    useEffect(() => {
        if (fornecedorData) {
            setId(fornecedorId || "");
            setNome(fornecedorData.nome || "");
            setCpf(fornecedorData.cpf || "");
            setCnpj(fornecedorData.cnpj || "");
            setUf(fornecedorData.uf || "");
            setCep(fornecedorData.cep || "");
            setTelefone(fornecedorData.telefone || "");
            setEndereco(fornecedorData.endereco || "");
            setCidade(fornecedorData.cidade || "");
            setEmail(fornecedorData.email || "");
            const tipoPessoa = fornecedorData.cpf ? "fisica" : fornecedorData.cnpj ? "juridica" : null;
            setTipoPessoa(tipoPessoa);
        }
    }, [fornecedorData, fornecedorId])

    const handleButtonClick = (tela) => {
        setTelaCadastrosAberta(tela);
    };

    const handleChangeCpf = (event) => {
        let value = event.target.value;
        value = cpfMascara(value);
        setCpf(value);
    };

    const handleChangeCnpj = (event) => {
        let value = event.target.value;
        value = cnpjMascara(value);
        setCnpj(value);
    };

    const handleChangeUf = (event) => {
        let value = event.target.value;
        value = ufMascara(value);
        setUf(value);
    };

    const handleChangeCep = (event) => {
        let value = event.target.value;
        value = cepMascara(value);
        setCep(value);
    };

    const handleChangeTelefone = (event) => {
        let value = event.target.value;
        value = telefoneMascara(value);
        setTelefone(value);
    };

    const verificarCamposObrigatorios = () => {
        if (tipoPessoa === "fisica") {
            return nome && telefone && email && cpf && cpf.length === 14;
        } else if (tipoPessoa === "juridica") {
            return nome && telefone && email && cnpj && cnpj.length === 18;
        } else {
            return false;
        }
    };

    const handleTipoPessoaChange = (newTipoPessoa) => {
        setTipoPessoa(newTipoPessoa);
        if (newTipoPessoa === "fisica") {
            setCnpj("");
        } else {
            setCpf("");
        }
    };

    // BOTÃO ALTERAR
    const alterarProduto = async () => {
        if (!verificarCamposObrigatorios()) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        if (tipoPessoa !== "fisica" && tipoPessoa !== "juridica") {
            alert("Por favor, selecione o tipo de pessoa.");
            return;
        }

        if (tipoPessoa === "fisica" && (!cpf || cpf.length !== 14)) {
            alert("Por favor, preencha o CPF corretamente.");
            return;
        } else if (tipoPessoa === "juridica" && (!cnpj || cnpj.length !== 18)) {
            alert("Por favor, preencha o CNPJ corretamente.");
            return;
        }

        if (!cep || cep.length !== 9) {
            alert("Por favor, preencha o CEP corretamente.");
            return;
        }

        if (!telefone || telefone.length !== 16) {
            alert("Por favor, preencha o telefone corretamente.");
            return;
        }

        const fornecedor = {
            id: fornecedorId,
            nome,
            endereco,
            cidade,
            uf,
            cep,
            telefone,
            email,
        };

        if (fornecedorData && tipoPessoa !== fornecedorData.tipoPessoa) {
            delete fornecedorData.cpf;
            delete fornecedorData.cnpj;
        }

        if (tipoPessoa === "fisica") {
            fornecedor.cpf = cpf;
            fornecedor.cnpj = null;
        } else if (tipoPessoa === "juridica") {
            fornecedor.cnpj = cnpj;
            fornecedor.cpf = null;
        }

        console.log("Alterando fornecedor:", fornecedor);

        try {
            const response = await fetch(`http://localhost:3000/api/v1/fornecedor/${fornecedorId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(fornecedor),
            });

            const result = await response.json();

            if (response.ok) {
                alert("Produto alterado com sucesso!");

                navigate("/cadastroProdutoInicial");
            } else {
                if (result.error) {
                    alert(result.error);
                } else {
                    alert("Erro ao alterar fornecedor. Verifique os dados e tente novamente.");
                }
                console.error("Erro ao alterar fornecedor:", result);
            }
        } catch (error) {
            console.error("Erro ao alterar fornecedor:", error);
            alert("Erro ao alterar fornecedor. Tente novamente.");
        }
    };


    // BOTÃO DELETAR
    const deletarProduto = async () => {
        if (!fornecedorId) {
            alert("ID do fornecedor não encontrado.");
            return;
        }

        if (!window.confirm("Tem certeza que deseja deletar este fornecedor?")) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/v1/fornecedor/${fornecedorId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                navigate("/cadastroProdutoInicial");
            } else {
                const result = await response.json();
                if (result.error) {
                    alert(result.error);
                } else {
                    alert("Erro ao deletar fornecedor. Tente novamente.");
                }
            }
        } catch (error) {
            console.error("Erro ao deletar fornecedor:", error);
            alert("Erro ao deletar fornecedor. Tente novamente.");
        }
    };

    return (
        <div>
            <Header />
            <div className="formulario">
                <label htmlFor="nome">NOME*</label>
                <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} maxLength="60" />

                <div className="radio-buttons">
                    <div className="radio-button-container">
                        <input type="radio" value="fisica" name="tipoPessoa" checked={tipoPessoa === "fisica"} onChange={() => handleTipoPessoaChange("fisica")} />
                        <label>Pessoa Física</label>
                    </div>
                    <div className="radio-button-container">
                        <input type="radio" value="juridica" name="tipoPessoa" checked={tipoPessoa === "juridica"} onChange={() => handleTipoPessoaChange("juridica")} />
                        <label>Pessoa Jurídica</label>
                    </div>
                </div>

                <div className="cpf-cnpj-container">
                    <div>
                        <label htmlFor="cpf">CPF*</label>
                        <input type="text" id="cpf" name="cpf" value={cpf} onChange={handleChangeCpf} maxLength="14" disabled={tipoPessoa !== "fisica"} />
                    </div>
                    <div>
                        <label htmlFor="cnpj">CNPJ*</label>
                        <input type="text" id="cnpj" name="cnpj" value={cnpj} onChange={handleChangeCnpj} maxLength="18" disabled={tipoPessoa !== "juridica"} />
                    </div>
                </div>

                <label htmlFor="endereco">ENDEREÇO</label>
                <input type="text" id="endereco" name="endereco" value={endereco} onChange={(e) => setEndereco(e.target.value)} maxLength="60" />

                <div className="localidade-container">
                    <div>
                        <label htmlFor="cidade">CIDADE</label>
                        <input type="text" id="cidade" name="cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} maxLength="30" />
                    </div>
                    <div>
                        <label htmlFor="uf">UF</label>
                        <input type="text" id="uf" name="uf" value={uf} onChange={handleChangeUf} maxLength="2" />
                    </div>
                    <div>
                        <label htmlFor="cep">CEP</label>
                        <input type="text" id="cep" name="cep" value={cep} onChange={handleChangeCep} maxLength="9" />
                    </div>
                </div>

                <div className="contato-container">
                    <div>
                        <label htmlFor="telefone">TELEFONE*</label>
                        <input type="text" id="telefone" name="telefone" value={telefone} onChange={handleChangeTelefone} maxLength="16" />
                    </div>
                    <div>
                        <label htmlFor="email">E-MAIL*</label>
                        <input type="text" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength="60" />
                    </div>
                </div>
            </div>
            <div className="botoes-crud">
                <div className="botoes-esquerda">
                    <button type="button" name="btIncluir" id="btIncluir" onClick={alterarProduto}>ALTERAR</button>
                </div>
                <div className="botoes-direita">
                    <button type="button" name="btDeletar" id="btDeletar" onClick={deletarProduto}>DELETAR</button>
                </div>
            </div>
        </div>
    );
};

// MÁSCARA PARA CPF
export const cpfMascara = (value) => {
    return value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");

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

// MÁSCARA UF
export const ufMascara = (value) => {
    value = value.replace(/[^A-Za-z]/g, "");
    value = value.toUpperCase();
    return value;
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
        formattedValue += ` ${sufixo1}`;
    }
    if (sufixo2) {
        formattedValue += `-${sufixo2}`;
    }
    return formattedValue.trim();
};

export default EditaProduto;
