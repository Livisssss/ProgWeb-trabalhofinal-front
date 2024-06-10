import React, { useState } from 'react';
import axios from 'axios';
import "./FornecedorForm.css";

const FornecedorForm = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/v1/fornecedor', {
        fornecedor: {
          nome,
          email,
          cnpj,
          endereco,
          telefone
        }
      });
      console.log(response.data);
      setNome('');
      setEmail('');
      setCnpj('');
      setEndereco('');
      setTelefone('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Cadastrar Fornecedor</h2>
      <div>
        <label>Nome:</label>
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label>CNPJ:</label>
        <input type="text" value={cnpj} onChange={(e) => setCnpj(e.target.value)} required />
      </div>
      <div>
        <label>Endereço:</label>
        <input type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} required />
      </div>
      <div>
        <label>Telefone:</label>
        <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
      </div>
      <button type="submit">Cadastrar</button>
    </form>
  );
};

export default FornecedorForm;
