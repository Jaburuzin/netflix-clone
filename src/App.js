import React, { useEffect, useState } from 'react';
import Tmdb from './Tmbd';
import MovieRow from './components/movieRow';
import './App.css';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';

export default () => {

  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      // Pegando a Lista Total
      let list = await Tmdb.getHomeList();
      setMovieList(list);    

      // Pegando o Featured

      let originals = list.filter(i=>i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFeaturedData(chosenInfo);
    }

    loadAll();
  }, []);

  useEffect(()=> {
    const scrollListener = () => {
      if(window.scrollY > 100) {
        setBlackHeader(true)
      } else {
        setBlackHeader(false)
      }
    }
    window.addEventListener('scroll', scrollListener());

    return () => {
      window.removeEventListener('scroll', scrollListener());
    }
  }, []);

  return (
    <div className="page">

      <Header black={blackHeader}/>

      {featuredData && 
      <FeaturedMovie item={featuredData}/>}

      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items}/>
        ))}
      </section>
      <footer>
        Feito com <span role="img" aria-label="coração">❤️</span> Pelo Jaburu<br></br>
        Direitos de imagem para <a href="https://netflix.com">Netflix</a><br></br>
        Dados pegos do site <a href="https://themoviedb.org">Themoviedb.org</a>
      </footer>
      {movieList.length <= 0 &&
      <div className="loading">
        <img src="https://cdn.lowgif.com/small/0534e2a412eeb281-the-counterintuitive-tech-behind-netflix-s-worldwide.gif" alt="Carregando"/>
      </div>
      }
    </div>
  )
}