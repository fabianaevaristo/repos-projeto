
import React, {useState, useEffect} from 'react';
import {Container, Owner, Loading, Backbutton, IssuesList, PageActions, FilterList} from './styles'
import { FaArrowLeft } from 'react-icons/fa';
import api from '../../services/api';

export default function Repositorio({match}){
  
  const [repositorio, setRepositorio] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState([
    {state: 'all', Label: 'Todas', action: true},
    {state: 'open', Label: 'Abertas', action: false},
    {state: 'closed', Label: 'Fechadas', action: false},
  ])
  const [filterIndex, setFilterIndex] = useState(0);
  
  useEffect(()=> {

    async function load(){
      const nomeRepo = decodeURIComponent(match.params.repositorio);
      
      const [repositorioData, issuesData] = await Promise.all([
        api.get(`/repos/${nomeRepo}`),
        api.get(`/repos/${nomeRepo}/issues`, {
          params:{
            state: filters.find(f => f.action).state, //coloca aqui dentro o all
            per_page: 5
          }
        })
      ]);

      setRepositorio(repositorioData.data);
      setIssues(issuesData.data);
      console.log(issuesData.data);
      setLoading(false);

    }

    load();

  }, [match.params.repositorio]);

  useEffect(() => {

    async function loadIssue(){
      const nomeRepo = decodeURIComponent(match.params.repositorio);

      const response = await api.get('/repos/${nomeRepo}/issues',{
        params:{
          state: filters[filterIndex].state, //filter[0].state
          page,
          per_page: 5,
        },
      });

      setIssues(response.data);
      //console.log(filterIndex);

    }

    loadIssue();
  }, [,filterIndex, filters, match.params.repositorio , page]); //da aula adicionou os dois paramentro, o meu só o page

  function handlePage(action){
    setPage (action === 'back' ? page - 1 : page + 1 )
  }

  function handleFilter(index) { //essa função eé quando clica em algum botão (todos,aberto,fechado)
    setFilterIndex(index);
    
  }

  if(loading){
    return(
      <Loading>
        <h1>Carregando...</h1>
      </Loading>
    )
  }
    
  return(
   <Container>
       <Backbutton to="/">
         <FaArrowLeft color="#000" size={30}/>
       </Backbutton>
       <Owner>
          <img 
          src={repositorio.owner.avatar_url} 
          aLt={repositorio.owner.login} //aqui estva alt, na aula aLt
          />
          <h1>{repositorio.name}</h1>
          <p>{repositorio.description}</p>
       </Owner> 

       <FilterList active = {filterIndex}>
          {filters.map((filter, index) => (
            <button
             type="button"
             key={filter.Label}
             onClick={()=> handleFilter(index)}
             >
               {filter.Label}
            </button>
          ) )} 
       </FilterList>
  
    
       <IssuesList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login}/>

              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>

                  {issue.labels.map(Label => (  //e aqui o Label é assim. aula 133 a 6:52
                    <span key={String(Label.id)}>{Label.name}</span> //aqui o da aula fica (label.id) e (label.name) 
                  ))}

                </strong>

                <p>{issue.user.login}</p>

              </div>
            </li>
          ))}
       </IssuesList>

       <PageActions>
         <button 
         type="button" 
         onClick={()=> handlePage('back')} //voltar
         disabled={page < 2}
         >
          Voltar
          </button>

         <button type="button" 
         onClick={()=> handlePage('next')} //próximo
         > 
          Proxima
          </button>

       </PageActions>
    </Container>
  )
} 