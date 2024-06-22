import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import { useLocation } from "react-router-dom";
import "./editaFornecedor.css";
import { useNavigate } from "react-router-dom";

const EditaFornecedor = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { fornecedorData, fornecedorId } = location.state || {};

    console.log (fornecedorData)

    const [id, setId] = useState("");
    const [nome, setNome] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [cep, setCep] = useState("");
    const [telefone, setTelefone] = useState("");
    const [endereco, setEndereco] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (fornecedorData) {
            setId(fornecedorId);
            setNome(fornecedorData.nome);
            setCnpj(fornecedorData.cnpj);
            setCep(fornecedorData.cep || "");
            setTelefone(fornecedorData.telefone);
            setEndereco(fornecedorData.endereco);
            setEmail(fornecedorData.email);
        }
    }, [fornecedorData, fornecedorId])

    const handleChangeCnpj = (event) => {
        let value = event.target.value;
        value = cnpjMascara(value);
        setCnpj(value);
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
        return nome && telefone && email && cnpj && endereco;
    };

    // BOTÃO ALTERAR
    const alterarFornecedor = async () => {
        if (!verificarCamposObrigatorios()) {
            alert("Por favor, preencha todos os campos obrigatórios.");
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
            cnpj,
            endereco,
            cep,
            telefone,
            email,
        };

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
                alert("Fornecedor alterado com sucesso!");

                navigate("/cadastroFornecedorInicial");
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
    const deletarFornecedor = async () => {
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
                navigate("/cadastroFornecedorInicial");
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
        <div className="content">
            <Header />
            <div className="formulario">
                <label htmlFor="nome">NOME*</label>
                <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} maxLength="60" />

            <div className="cnpj-cep-container">
                <div>
                    <label htmlFor="cnpj">CNPJ*</label>
                    <input type="text" id="cnpj" name="cnpj" value={cnpj} onChange={handleChangeCnpj} maxLength="18" />
                </div>
                <div>
                    <label htmlFor="cep">CEP (consulte seu endereço)</label>
                    <input type="text" id="cep" name="cep" value={cep} onChange={handleChangeCep} maxLength="9" />
                </div>
            </div>

            <label htmlFor="endereco">ENDEREÇO*</label>
            <input type="text" id="endereco" name="endereco" value={endereco} onChange={(e) => setEndereco(e.target.value)} maxLength="60" />

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
                    <button type="button" name="btIncluir" id="btIncluir" onClick={alterarFornecedor}>ALTERAR</button>
                </div>
                <div className="botoes-direita">
                    <button type="button" name="btDeletar" id="btDeletar" onClick={deletarFornecedor}>DELETAR</button>
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

export default EditaFornecedor;
