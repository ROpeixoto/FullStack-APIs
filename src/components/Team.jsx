const Team = () => {
    return (
      <div className="page-content">
        <h2>Our Development Team</h2>
        
        <section className="team-introduction">
          <p className="half-ahead-content">Computer Engineering Students at University SENAI CIMATEC:</p>
        </section>
  
        <section className="team-members">
          <div className="team-member">
            <h3> Emanuele Penteado:</h3>
            <p className="half-ahead-content">
              <a href="https://manupenteado.vercel.app/" target="_blank" rel="noopener noreferrer" className="repo-link">
                View Emanuele's Portfolio
              </a>
            </p>
          </div>
  
          <div className="team-member">
            <h3> Rodrigo Peixoto:</h3>
            <p className="half-ahead-content">
              <a href="https://portfolio-rodrigo-gamma.vercel.app/" target="_blank" rel="noopener noreferrer" className="repo-link">
                View Rodrigo's Portfolio
              </a>
            </p>
          </div>
  
          <div className="team-member">
            <h3> Leonardo Andrade:</h3>
            <p className="half-ahead-content">
              <a href="https://leonardo-andrade.vercel.app/" target="_blank" rel="noopener noreferrer" className="repo-link">
                View Leonardo's Portfolio
              </a>
            </p>
          </div>
        </section>
  
        <section className="team-contact">
          <p className="ahead-content">Contact information is available in each member's portfolio.</p>
        </section>
  
        <div className="team-appreciation">
          <h4>With Gratitude</h4>
          <p className="half-ahead-content">
            We sincerely appreciate your interest in our project and thank you for your support.
          </p>
        </div>
      </div>
    );
  };
  
  export default Team;