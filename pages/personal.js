import AboutMe from './projects/AboutMe.js';
import Project1 from './projects/Project1.js';
import Project2 from './projects/Project2.js';
import Project3 from './projects/Project3.js';
import Project4 from './projects/Project4.js';
import ProjectRFA from './projects/ProjectRFA.js';

const App = () => {
  const [isDesktop, setIsDesktop] = React.useState(window.matchMedia('(min-aspect-ratio: 1/1) and (min-height: 500px)').matches);
  const [activeProject, setActiveProject] = React.useState(React.createElement(AboutMe));
  const [activeMobileProject, setActiveMobileProject] = React.useState(null);
  const [selectedButton, setSelectedButton] = React.useState('about');

  const handleBackClick = () => {
    console.log('Back button clicked');
    window.location.href = '../'; // Redirect to the home page
  };

  const handleProjectClick = (projectComponent, projectName) => {
    console.log('Project button clicked');
    setSelectedButton(projectName);
    if (isDesktop) {
      setActiveProject(projectComponent); // Update the active project with its component for desktop mode
    } else {
      // Toggle drop-down view for mobile devices
      if (activeMobileProject === projectName) {
        setActiveMobileProject(null); // Close the drop-down view if the same project button is pressed again
      } else {
        setActiveMobileProject(projectName);
      }
    }
  };

  const handleAboutMeClick = () => {
    console.log('About me button clicked');
    setSelectedButton('about');
    if (isDesktop) {
      setActiveProject(React.createElement(AboutMe)); // Update the active project with the 'About Me' component for desktop mode
    } else {
      setActiveMobileProject(null); // Close any open dropdowns in mobile mode
    }
  };

  // Paths to logos
  const reactjsLogo = { src: '../assets/images/otherlogos/reactlogo.png', name: 'React.js' };
  const threejslogo = { src: '../assets/images/otherlogos/threejslogo.png', name: 'Three.js' };
  const csslogo = { src: '../assets/images/otherlogos/csslogo.png', name: 'CSS' };
  const htmllogo = { src: '../assets/images/otherlogos/htmllogo.png', name: 'HTML' };
  const pythonlogo = { src: '../assets/images/otherlogos/pythonlogo.png', name: 'Python' };
  const roslogo = { src: '../assets/images/otherlogos/roslogo.png', name: 'ROS' };
  const ros2logo = { src: '../assets/images/otherlogos/ros2logo.png', name: 'ROS 2' };
  const simulinklogo = { src: '../assets/images/otherlogos/simulinklogo.png', name: 'Simulink' };
  const nxlogo = { src: '../assets/images/otherlogos/nxlogo.png', name: 'Siemens NX' };
  const matlablogo = { src: '../assets/images/otherlogos/matlablogo.png', name: 'MATLAB' };
  const clogo = { src: '../assets/images/otherlogos/clogo.png', name: 'C' };
  const cpplogo = { src: '../assets/images/otherlogos/cpplogo.png', name: 'C++' };
  const dockerlogo = { src: '../assets/images/otherlogos/dockerlogo.png', name: 'Docker' };
  const apachekafkalogo = { src: '../assets/images/otherlogos/apachekafkalogo.png', name: 'Apache Kafka' };

  // Projects List
  const projects = [
    {
      name: 'GNC Internship at RFA',
      component: React.createElement(ProjectRFA),
      logos: [pythonlogo, dockerlogo, apachekafkalogo, csslogo, htmllogo]
    },
    {
      name: 'Personal Website',
      component: React.createElement(Project1),
      logos: [reactjsLogo, threejslogo, csslogo, htmllogo]
    },
    {
      name: 'Wheeled-Legged Thesis',
      component: React.createElement(Project2),
      logos: [pythonlogo, cpplogo, ros2logo, simulinklogo, nxlogo]
    },
    {
      name: 'Control Systems TA',
      component: React.createElement(Project3),
      logos: [pythonlogo, matlablogo, simulinklogo]
    },
    {
      name: 'Studies at ETHz',
      component: React.createElement(Project4),
      logos: [clogo, cpplogo, pythonlogo, matlablogo, simulinklogo, roslogo, nxlogo]
    }
  ];

  // Use an effect to listen for window resize events
  React.useEffect(() => {
    const handleResize = () => {
      const isDesktopView = window.matchMedia('(min-aspect-ratio: 1/1) and (min-height: 500px)').matches;
      if (!isDesktopView && isDesktop) {
        // Switch to 'About Me' when entering mobile mode
        setActiveProject(React.createElement(AboutMe));
        setActiveMobileProject(null); // Close any open dropdowns in mobile mode
        setSelectedButton('about'); // Reset selected button to "about"
      } else if (isDesktopView && !isDesktop) {
        // Also reset selected button to "about" when entering desktop mode
        setSelectedButton('about');
      }
      setIsDesktop(isDesktopView);
    };
  
    window.addEventListener('resize', handleResize);
  
    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isDesktop]);

  return React.createElement(React.Fragment, null,
    !isDesktop && React.createElement('button', { className: 'back-button', onClick: handleBackClick, type: 'button' }, '<<< Back'),
    React.createElement('div', { className: 'split-left' },

      isDesktop && React.createElement('div', { className: 'desktop-buttons-container' },
        React.createElement('button', {
          className: 'back-desktop-button',
          onClick: handleBackClick,
          style: { width: '50%' },
          type: 'button'
        }, 'Back'),
        React.createElement('button', {
          className: 'disclaimer-desktop-button',
          onClick: () => { },  // Add this function to handle the Disclaimer click
          style: { width: '50%' },
          type: 'button'
        }, 'Disclaimer')
      ),
    
      // New div containing About Me and Project buttons
      React.createElement('div', { className: 'split-left-buttons' },
        isDesktop && React.createElement('button', {
          className: `about-button ${selectedButton === 'about' ? 'selected' : ''}`,
          onClick: handleAboutMeClick,
        }, 'About Me'),
        projects.map((project, index) =>
          React.createElement(React.Fragment, { key: index },
            React.createElement('button', {
              className: `project-button ${
                (isDesktop && activeProject.type === project.component.type) ||
                (!isDesktop && activeMobileProject === project.name) ||
                selectedButton === project.name
                  ? 'selected'
                  : ''
              }`,
              onClick: () => handleProjectClick(project.component, project.name)
            },
              React.createElement('div', { className: 'project-button-content' },
                React.createElement('span', { className: 'project-name' }, project.name),
                React.createElement('div', { className: 'project-logos' },
                  project.logos.map((logo, logoIndex) =>
                    React.createElement('img', {
                      key: logoIndex,
                      className: 'project-logo',
                      src: logo.src,
                      alt: `${project.name} Logo`,
                      title: logo.name  // Tooltip text
                    })
                  )
                )
              )),
            !isDesktop && activeMobileProject === project.name && React.createElement('div', { className: 'mobile-dropdown' },
              project.component // Render the component for the dropdown
            )
          )
        )
      )
    ),    
    React.createElement('div', { className: 'split-right' },
      activeProject // Render the active project component in the split-right section
    )
  );
};

ReactDOM.render(React.createElement(App), document.getElementById('root'));
