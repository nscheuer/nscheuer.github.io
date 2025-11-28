const ProjectRFA = () => {
  const containerStyle = {
    display: 'flex',
    alignItems: 'flex-start'
  };

  const textContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    marginRight: '10px',
  };

  const linkContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: '20px',
    marginBottom: '10px',
  };

  const h2Style = {
    fontSize: 'clamp(1.5rem, 2.5vw, 2.5rem)', // Adjust these values as needed
    margin: 0,
    marginBottom: '10px' // Adjust margin
  };

  const pStyle = {
    fontSize: 'clamp(1rem, 2vw, 1.5rem)', // Adjust these values as needed
    margin: 0,
  };

  const linkStyle = {
    fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)', // Adjust these values as needed
    margin: 0,
  };

  const statusStyle = {
    fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)', // Adjust these values as needed
    marginLeft: '5px',
    color: '#00FFFF' 
  };

  const imageStyle = {
    height: 'auto',
    marginLeft: '20px' // Adjust margin as needed for spacing
  };

  return React.createElement(
    'div',
    { style: containerStyle },
    React.createElement(
      'div',
      { style: textContainerStyle },
      React.createElement('h2', { style: h2Style }, 'GNC at Rocket Factory Augsburg'),
      React.createElement(
        'div',
        { style: linkContainerStyle },
        React.createElement('p', { style: linkStyle }, 'status:', React.createElement('span', { style: statusStyle }, 'ongoing')),
      ),
      React.createElement('p', { style: pStyle }, 'Guidance, Navigation, and Control internship at ', React.createElement('a', {
        href: 'https://www.rfa.space/',
        style: { color: 'white', textDecoration: 'underline' },
        target: '_blank', // Optional: Opens the link in a new tab
        rel: 'noopener noreferrer' // Security measure for external links
      }, 'Rocket Factory Augsburg'),
      ' Working on orbital insertion Functional Engineering Software (FES), as well as fully writing and deploying a Live Day-of-Launch data dashboard.')
    ),
    React.createElement('img', {
      src: '../../~nscheuer/assets/images/projects/RFAlaunch.png',
      alt: 'Project RFA',
      className: 'project-image',
    })
  );
};

export default ProjectRFA;
