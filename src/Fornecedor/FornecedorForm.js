import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InputMask from 'react-input-mask';
import "./FornecedorForm.css";

const FornecedorForm = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [fornecedores, setFornecedores] = useState([]);
  const [editId, setEditId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchFornecedores = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/fornecedor');
        setFornecedores(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFornecedores();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const fornecedor = {
      nome,
      email,
      cnpj,
      endereco,
      telefone,
      cep
    };

    try {
      let response;
      if (editId) {
        // Update existing fornecedor
        response = await axios.put(`http://localhost:3000/api/v1/fornecedor/${editId}`, { fornecedor });
        setSuccessMessage('Fornecedor atualizado com sucesso!');
        setEditId(null);
      } else {
        // Create new fornecedor
        response = await axios.post('http://localhost:3000/api/v1/fornecedor', { fornecedor });
        setSuccessMessage('Fornecedor cadastrado com sucesso!');
      }

      // Refresh fornecedores list
      const updatedResponse = await axios.get('http://localhost:3000/api/v1/fornecedor');
      setFornecedores(updatedResponse.data);
    } catch (error) {
      setErrorMessage('Erro ao cadastrar fornecedor. Tente novamente.');
      console.error(error);
    } finally {
      // Clear form
      setNome('');
      setEmail('');
      setCnpj('');
      setEndereco('');
      setTelefone('');
      setCep('');
    }
  };

  const handleEdit = (fornecedor) => {
    setEditId(fornecedor.id);
    setNome(fornecedor.nome);
    setEmail(fornecedor.email);
    setCnpj(fornecedor.cnpj);
    setEndereco(fornecedor.endereco);
    setTelefone(fornecedor.telefone);
    setCep(fornecedor.cep);
    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <div className='container'>
      <form className='formFornecedor' onSubmit={handleSubmit}>
        <h2>{editId ? 'Editar Fornecedor' : 'Cadastrar Fornecedor'}</h2>
        {successMessage && <p className='success'>{successMessage}</p>}
        {errorMessage && <p className='error'>{errorMessage}</p>}
          <div>
            <label>Nome:</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>
        <div className='nome-cnpj'>
          <div className='field'>
            <label>CNPJ:</label>
            <InputMask
              mask="99.999.999/9999-99"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              required
            >
              {(inputProps) => <input type="text" {...inputProps} />}
            </InputMask>
          </div>
          <div className='field'>
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
        </div>
        <div className='cep-endereco'>
          <div className='field'>
            <label>Telefone:</label>
            <InputMask
              mask="(99) 99999-9999"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            >
              {(inputProps) => <input type="text" {...inputProps} />}
            </InputMask>
          </div>
          <div className='field'>
            <label>CEP:</label>
            <InputMask
              mask="99999-999"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              required
            >
              {(inputProps) => <input type="text" {...inputProps} />}
            </InputMask>
          </div>
        </div>
          <div>
            <label>Endereço:</label>
            <input type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} required />
          </div>
        
        <button type="submit">{editId ? 'Atualizar' : 'Cadastrar'}</button>
      </form>
      <div className='fornecedorList'>
        <h2>Lista de Fornecedores</h2>
        <ul>
          {fornecedores.length > 0 ? (
            fornecedores.map((fornecedor) => (
              <li key={fornecedor.id}>
                <span>{fornecedor.nome} - {fornecedor.cnpj}</span>
                <button onClick={() => handleEdit(fornecedor)}>Editar</button>
              </li>
            ))
          ) : (
            <p>Nenhum fornecedor encontrado.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default FornecedorForm;
