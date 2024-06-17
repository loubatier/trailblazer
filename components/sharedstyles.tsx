import styled from "styled-components";

const Main = styled.main`
  margin-left: 64px;
  padding: 48px 0;
`;

const Title = styled.h1`
  margin: 0;
  line-height: 1.15;
  font-size: 4rem;
  text-align: center;
  text-decoration: none;

  a {
    color: ${({ theme }) => theme.colors.secondary};
    text-decoration: none;
    &:hover,
    :focus,
    :active {
      text-decoration: underline;
    }
  }
`;

const Description = styled.p`
  text-align: center;
  line-height: 1.5;
  font-size: 1.5rem;
`;
const CodeTag = styled.code`
  background: #fafafa;
  border-radius: 5px;
  margin: 0 0.75rem;
  padding: 0.75rem;
  font-size: 1.1rem;
  font-family:
    Menlo,
    Monaco,
    Lucida Console,
    Liberation Mono,
    DejaVu Sans Mono,
    Bitstream Vera Sans Mono,
    Courier New,
    monospace;
`;

const Select = styled.select`
  padding: 8px 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  transition: border-color 0.2s;

  &:focus {
    border-color: #0070f3;
    outline: none;
  }
`;

const Input = styled.input`
  padding: 8px 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  transition: border-color 0.2s;

  &:focus {
    border-color: #0070f3;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 8px 16px;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  background-color: #0070f3;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #005bb5;
  }

  &:focus {
    outline: none;
    background-color: #005bb5;
  }
`;

export { Main, Title, Description, CodeTag, Select, Input, Button };
