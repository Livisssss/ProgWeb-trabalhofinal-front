import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProdutoForm = () => {
  const [fornecedorId, setFornecedorId] = useState('');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [preco, setPreco] = useState('');
  const [observacao, setObservacao] = useState('');
  const [fornecedores, setFornecedores] = useState([]);

  useEffect(() => {
    const fetchFornecedores = async () => {
      const response = await axios.get('http://localhost:3000/api/v1/fornecedor');
      setFornecedores(response.data);
    };
    fetchFornecedores();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/v1/produto', {
        produto: {
          fornecedor_id: fornecedorId,
          nome,
          descricao,
          quantidade,
          preco,
          observacao
        }
      });
      console.log(response.data);
      setFornecedorId('');
      setNome('');
      setDescricao('');
      setQuantidade('');
      setPreco('');
      setObservacao('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Cadastrar Produto</h2>
      <div>
        <label>Fornecedor:</label>
        <select value={fornecedorId} onChange={(e) => setFornecedorId(e.target.value)} required>
          <option value="">Selecione um Fornecedor</option>
          {fornecedores.map((fornecedor) => (
            <option key={fornecedor.id} value={fornecedor.id}>
              {fornecedor.nome}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Nome:</label>
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
      </div>
      <div>
        <label>Descrição:</label>
        <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
      </div>
      <div>
        <label>Quantidade:</label>
        <input type="number" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} required />
      </div>
      <div>
        <label>Preço:</label>
        <input type="number" value={preco} onChange={(e) => setPreco(e.target.value)} required />
      </div>
      <div>
        <label>Observação:</label>
        <input type="text" value={observacao} onChange={(e) => setObservacao(e.target.value)} />
      </div>
      <button type="submit">Cadastrar</button>
    </form>
  );
};

export default ProdutoForm;
