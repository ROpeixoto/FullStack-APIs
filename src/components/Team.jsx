const Team = () => {
    return (
      <div className="page-content">
        <h2>Our Development Team</h2>
        
        <section className="team-introduction">
          <p>Computer Engineering Students at University SENAI CIMATEC:</p>
        </section>
  
        <section className="team-members">
          <div className="team-member">
            <h3> Emanuele Penteado:</h3>
            <p>
              <a href="https://manupenteado.vercel.app/" target="_blank" rel="noopener noreferrer" className="repo-link">
                View Emanuele's Portfolio
              </a>
            </p>
          </div>
  
          <div className="team-member">
            <h3> Rodrigo Peixoto:</h3>
            <p>
              <a href="https://portfolio-rodrigo-gamma.vercel.app/" target="_blank" rel="noopener noreferrer" className="repo-link">
                View Rodrigo's Portfolio
              </a>
            </p>
          </div>
  
          <div className="team-member">
            <h3> Leonardo Andrade:</h3>
            <p>
              <a href="https://leonardo-andrade.vercel.app/" target="_blank" rel="noopener noreferrer" className="repo-link">
                View Leonardo's Portfolio
              </a>
            </p>
          </div>
        </section>
  
        <section className="team-contact">
          <p>Contact information is available in each member's portfolio.</p>
        </section>
  
        <div className="team-appreciation">
          <h4>With Gratitude</h4>
          <p className="highlight">
            We sincerely appreciate your interest in our project and thank you for your support.
          </p>
        </div>
      </div>
    );
  };
  
  export default Team;