import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  html,
  body {
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.application_background};
    padding: 0;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  p {
    margin: 0;
  }

  * {
    box-sizing: border-box;
  }

  input {
    border-style: none; 
    background: transparent; 
    outline: none;
  }

  button { 
    padding: 0; 
    background: none; 
    border: none; 
    outline: none;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export default GlobalStyle;
