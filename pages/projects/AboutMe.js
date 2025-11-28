const AboutMe = () => {
    const containerStyle = {
      display: 'flex',
      alignItems: 'flex-start'
    };
  
    const textContainerStyle = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start'
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
  
    const imageStyle = {
      height: '150px',
      marginLeft: '20px' // Adjust margin as needed for spacing
    };
  
    return React.createElement(
      'div',
      { style: containerStyle },
      React.createElement(
        'div',
        { style: textContainerStyle },
        React.createElement('h2', { style: h2Style }, 'About Me'),
        React.createElement('p', { style: pStyle }, 'Hi I\'m Nic, a mechanical engineering student studying at ETHz. I have a passion for robotics, spaceflight, and programming.')
      ),
      React.createElement('img', {
        src: '../../~nscheuer/assets/images/mylogo/concordeeclipse.jpg',
        alt: 'About Me',
        style: imageStyle
      })
    );
  };
  
  export default AboutMe;
  