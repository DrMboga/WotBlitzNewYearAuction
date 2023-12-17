import React from 'react';
import './App.css';
import { Container, createTheme, CssBaseline, Link, ThemeProvider } from '@mui/material';
import { Auction } from './Components/Auction';

function App() {
  const theme = createTheme({
    palette: {
      mode: 'dark',
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth={false}>
        <h4>
          <Link href="https://eu.wotblitz.com/en/auction/#/">WOT Blitz Auction</Link>
        </h4>
        <Auction></Auction>
      </Container>
    </ThemeProvider>
  );
}

export default App;
