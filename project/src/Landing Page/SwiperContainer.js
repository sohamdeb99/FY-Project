import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Button from '@mui/material/Button';
import './App.css';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const slides = [
  {
    imgPath: '/bg1.jpg',
    title: 'Stay Vigilant in the Digital World',
    description: 'Learn the essentials of cybersecurity to protect yourself online. Awareness is the first step towards a secure digital presence.',
    buttonText: 'Login/Register',
  },
  {
    imgPath: '/bg.jpg',
    title: 'Detect & Prevent Cyber Threats',
    description: 'Utilize advanced tools and techniques to identify potential cyber threats before they become a problem.',
    buttonText: 'Explore',
  },
  {
    imgPath: '/bg3.jpg',
    title: 'Adopt Secure Online Practices',
    description: 'Explore best practices to safeguard your data. Secure your digital footprint with smart, proactive strategies.',
    buttonText: 'Discover',
  },
  {
    imgPath: '/bg5.jpg',
    title: 'Gain Insights from Cybersecurity Experts',
    description: 'Stay ahead in cybersecurity with insights from leading experts. Learn about the latest trends and protective measures.',
    buttonText: 'Stay Updated',
  },
];

function SwipeableTextMobileStepper({ openModal }) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = slides.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => Math.min(prevActiveStep + 1, maxSteps - 1));
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => Math.max(prevActiveStep - 1, 0));
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <Box sx={{ maxWidth: '100%', flexGrow: 1, position: 'relative', overflow: 'hidden' }}>
      <AutoPlaySwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
        interval={5000}
      >
        {slides.map((slide, index) => (
          <Box key={slide.imgPath} sx={{ position: 'relative', height: '650px' }}>
            <Box
              component="img"
              sx={{
                height: '100%',
                display: 'block',
                maxWidth: '100%',
                overflow: 'hidden',
                width: '100%',
              }}
              src={slide.imgPath}
              alt={slide.title}
            />
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                padding: '60px',
                borderRadius: '15px',
                width: '25%',
                height: '25%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography variant="h5" component="h2" color="gold" sx={{ mb: 2 }}>
                {slide.title}
              </Typography>
              <Typography sx={{ mb: 2 }}>
                {slide.description}
              </Typography>
              <Button variant="contained" className="login-button" onClick={openModal}>
                {slide.buttonText}
              </Button>
            </Box>
          </Box>
        ))}
      </AutoPlaySwipeableViews>
      <IconButton
        sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '10px', 
          transform: 'translateY(-50%)', 
          zIndex: 1, 
          color: '#1976d2', 
          '&:hover': { 
            backgroundColor: 'transparent', 
            transform: 'translateY(-50%)' 
          } 
        }} 
        onClick={handleBack} 
        disabled={activeStep === 0}
      >
        <ArrowBackIosNewIcon />
      </IconButton>
      <IconButton
        sx={{ 
          position: 'absolute', 
          top: '50%', 
          right: '10px', 
          transform: 'translateY(-50%)', 
          zIndex: 1, 
          color: '#1976d2', 
          '&:hover': { 
            backgroundColor: 'transparent', 
            transform: 'translateY(-50%)' 
          } 
        }} 
        onClick={handleNext} 
        disabled={activeStep === maxSteps - 1}
      >
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>
  );
}

export default SwipeableTextMobileStepper;