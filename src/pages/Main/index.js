
import React, {useState, useCallback, useEffect} from 'react';
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash} from 'react-icons/fa';
import {Container, Form, SubmitButton, List, DeleteButton } from './styles';
import {Link} from 'react-router-dom'
import api from '../../services/api';

export default function Main(){

  const [newRepo, setNewrepo] = useState ('');
  const [repositorios, setRepositorios] = useState ([]);
  const [loadind, setLoadind] = useState(false);
  const [alert, setAlert] = useState(null);
  
  //DidMount (buscar)
  useEffect(()=>{
    const repoStorage = localStorage.getItem('repos');

    if(repoStorage){
      setRepositorios(JSON.parse(repoStorage));
    }
  }, []);

  //DidUpdate (Salvar alterações)
  useEffect(()=>{
    localStorage.setItem('repos', JSON.stringify(repositorios));
  }, [repositorios]);


  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    async function submit(){
      setLoadind(true);
      setAlert(null);
      try{

        if(newRepo === ''){
          throw new Error('Você precisa indicar um repositorio!');
        }

        const response = await api.get(`repos/${newRepo}`);

        const hasRepo = repositorios.find(repo => repo.name === newRepo);

        if(hasRepo){
          throw new Error('Repositorio Duplicado');
        }

        const data = {
          name: response.data.full_name,
      }
  
      setRepositorios([...repositorios, data]);
      setNewrepo('');
      
      }catch(error){
        setAlert(true);
        console.log(error);
      }finally{
        setLoadind(false);
      }

    }

    submit();

  }, [newRepo, repositorios]);

  function handleinputChange(e){
    setNewrepo(e.target.value);
    setAlert(null);
  }

  const handleDelete = useCallback((repo) => {
    const find = repositorios.filter(r => r.name !== repo);
    setRepositorios(find);
  }, [repositorios]);

  return(
    <Container>

      <h1>
        <FaGithub size={25}/>
        Meus Repositorios
      </h1>

      <Form onSubmit={handleSubmit} error={alert}>
        <input
        type="text" 
        placeholder="Adicionar Repositorios"
        value={newRepo}
        onChange={handleinputChange}
        />

        <SubmitButton loading={loadind ? 1 : 0}>
          {loadind ? (
            <FaSpinner color="#FFF" size={14}/>
          ) : (
            <FaPlus color="#FFF" sizes={14}/>
          )}          
        </SubmitButton>

      </Form>

      <List>
        {repositorios.map(repo => (
          <li key={repo.name}>
            <span>
            <DeleteButton onClick={()=>handleDelete(repo.name) }>
              <FaTrash size={14}/>
            </DeleteButton>
            {repo.name}
            </span>
            <Link to={`/repositorio/${encodeURIComponent(repo.name) }`}>
              <FaBars size={20}/>
            </Link>
          </li>
        ))}
      </List>
      
    </Container>
  )
} 