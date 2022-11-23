import React, { useEffect , useState } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props)=> {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [exhausted, setExhausted] = useState();
  
  

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  
  const  updateNews = async ()=> {
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true);
    let data = await fetch(url);
    props.setProgress(40);
    let parseData = await data.json();
    props.setProgress(80);
    setArticles(parseData.articles)
    setTotalResults(parseData.totalResults)
    setLoading(false);
    setExhausted(true);
    
    props.setProgress(100);
  }

  useEffect(()=>{
      document.title = `Taaza Khabar - ${capitalizeFirstLetter(
        props.category
      )}`;
    updateNews();
     /* eslint-disable */ 
  },[])

 

  // const handlePrevClick = async () => {
  //   setPage(page-1)
  //   updateNews();
  // };

  // const handleNextClick = async () => {
  //   setPage(page+1)
  //   updateNews();
  // };

  const fetchMoreData = async() => {
    
    
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
    setPage(page+1)
    let data = await fetch(url);
    let parseData = await data.json();
    setArticles(articles.concat(parseData.articles))
    setTotalResults(parseData.totalResults)
    setLoading(false)
   
    if(page + 1 > Math.ceil(totalResults/props.pageSize)){
      setExhausted(false);
    }
  };


    return (
      <>
        <h1 className="text-center" style={{ margin: "30px", marginTop: "90px" }}>
          Taaza Khabar - Top Headlines from{" "}
          {capitalizeFirstLetter(props.category)}
        </h1>
        {loading && <Spinner />}

        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={exhausted === true}
          loader={<Spinner/>}
        >
        <div className="container">
        <div className="row">
          {articles.map((element) => {
              return (
                <div className="col-md-4" key={element.url}>
                  <NewsItem
                    title={element.title ? element.title.slice(0, 42) : ""}
                    description={
                      element.description
                        ? element.description.slice(0, 82)
                        : ""
                    }
                    imgUrl={element.urlToImage}
                    newsUrl={element.url}
                    author={element.author}
                    date={element.publishedAt}
                    source={element.source.name}
                  />
                </div>
              );
            })}
        </div>
        </div>
        </InfiniteScroll>
      </>
    );

}

News.defaultProps = {
  country: "in",
  pageSize: 5,
  category: "general",
}

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
}

export default News;
