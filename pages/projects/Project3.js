const Project3 = () => {
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
    color: '#00FF7F' // Green color for "completed"
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
      React.createElement('h2', { style: h2Style }, 'Control Systems Teaching Assistant'),
      React.createElement(
        'div',
        { style: linkContainerStyle },
        React.createElement('p', { style: linkStyle }, 'status:', React.createElement('span', { style: statusStyle }, 'completed')),
        React.createElement('a', {
          href: 'https://github.com/idsc-frazzoli/cs2solutions',
          className: 'actuallinkstyle',
          target: '_blank', // Optional: Opens the link in a new tab
          rel: 'noopener noreferrer' // Security measure for external links
        }, 'GitHub cs2solutions'),
        React.createElement('a', {
          href: 'https://github.com/idsc-frazzoli/CS2-2024-notebooks',
          className: 'actuallinkstyle',
          target: '_blank', // Optional: Opens the link in a new tab
          rel: 'noopener noreferrer' // Security measure for external links
        }, 'GitHub CS2 Python Notebooks') // The new link text
      ),
      React.createElement(
        'p',
        { style: pStyle },
        'In 2023 and 2024, I worked at the ',
        React.createElement('a', {
          href: 'https://idsc.ethz.ch/',
          style: { color: 'white', textDecoration: 'underline' },
          target: '_blank', // Optional: Opens the link in a new tab
          rel: 'noopener noreferrer' // Security measure for external links
        }, 'IDSC'),
        ' as a teaching assistant for Control Systems I and II. Apart from creating exercise sheets and teaching students, I also created demonstration code in Python and MATLAB to help students understand the theoretical concepts. This culminated in the creation of the Python package "cs2solutions".'
      )  
    ),
    React.createElement('img', {
      src: '../../~nscheuer/assets/images/projects/csta.png',
      alt: 'Project 3',
      className: 'project-image',
    })
  );
};

export default Project3;
