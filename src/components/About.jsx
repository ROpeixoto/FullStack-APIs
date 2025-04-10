const About = () => {
    return (
      <div className="page-content">
        <h2>About This Project</h2>
        <p>
          Developed as part of the Fullstack Development course in the Computer Engineering program at SENAI CIMATEC, 
          this project represents our first comprehensive experience with API integration and web application development.
        </p>
            <p>
            The application leverages two powerful APIs:
          </p>
          <ul>
            <li>
            <a 
              href="https://developer.themoviedb.org/docs/getting-started" 
              target="_blank" 
              rel="noopener noreferrer"
              className="repo-link"
            >TMDB API</a>: Provides comprehensive movie data including titles, ratings, release dates, and overviews
            </li>
            <li>
            <a 
              href="https://api.watchmode.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="repo-link"
            >WatchMode API</a>: Supplies streaming availability information across multiple platforms
            </li>
          </ul>
  
          <h3>Educational Value</h3>
          <p>
            Through this project, we gained hands-on experience with:
          </p>
          <ul>
            <li>API integration and data fetching</li>
            <li>React component architecture</li>
            <li>State management in frontend applications</li>
            <li>Responsive UI design principles</li>
          </ul>
  
          <h3>Source Code</h3>
          <p>
            The complete project repository is available on GitHub:
            <br/>
            <a 
              href="https://github.com/ROpeixoto/FullStack-APIs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="repo-link"
            >
              View Project Repository
            </a>
          </p>
  
          <p>
            This project opened our eyes to the vast possibilities of API-driven development and served as 
            an excellent introduction to full-stack engineering concepts.
          </p>
      </div>
    );
  };
  
  export default About;