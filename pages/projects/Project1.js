const Project1 = () => {
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
        React.createElement('h2', { style: h2Style }, 'Personal Website'),
        React.createElement(
          'div',
          { style: linkContainerStyle },
          React.createElement('p', { style: linkStyle }, 'status:', React.createElement('span', { style: statusStyle }, 'ongoing')),
        ),
        React.createElement('p', { style: pStyle }, 'Built my first personal website using React.js and Three.js, diving into web development for the first time. Explored interactive 3D graphics and modern web technologies, learning and applying new skills along the way.')
      ),
      React.createElement('img', {
        src: '../../~nscheuer/assets/images/projects/personalwebsite.png',
        alt: 'Project 2',
        className: 'project-image',
      })
    );
  };
  
  export default Project1;
  