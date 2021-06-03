import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

const bgColors = {
  black: '#3a3f4a',
  blue: '#2b4061',
  white: '#fff',
};

const textColor = {
  black: '#f3f4f5',
  blue: '#f3f4f5',
  white: '#3a3f4a',
};

const borderColor = {
  black: '#181a1e',
  blue: '#1f2e45',
  white: '#d1d5db',
};

const hoverBg = {
  black: '#31363f',
  blue: '#253753',
  white: '#f9fafb',
};

const focusBoxShadow = {
  black: '0 0 0 4px rgba(149, 152, 162, 0.4)',
  blue: '0 0 0 4px rgba(65, 141, 203, 0.4)',
  white: '0 0 0 4px rgba(149, 152, 162, 0.4)',
};

const focusBorder = {
  black: '#303137',
  blue: '#2563eb',
  white: '#a5acb6',
};

const svgColor = {
  black: 'rgba(255, 255, 255, 0.5)',
  blue: 'rgba(255, 255, 255, 0.5)',
  white: '#b0b7c1',
};

const ButtonStyles = styled.button`
  padding: 0.75rem 1.25rem;
  width: 100%;
  height: 2.625rem;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => bgColors[props.color]};
  color: ${(props: Props) => textColor[props.color]};
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.011em;
  border: 1px solid ${(props: Props) => borderColor[props.color]};
  border-radius: 0.375rem;
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  cursor: pointer;

  &:hover:not(:disabled) {
    background-color: ${(props: Props) => hoverBg[props.color]};
  }

  &:focus {
    outline: none;
    box-shadow: ${(props: Props) => focusBoxShadow[props.color]};
    border-color: ${(props: Props) => focusBorder[props.color]};
  }

  &:disabled {
    background-color: #434855;
    cursor: default;
  }

  svg {
    margin: 0 0.3125rem 0 0;
    height: 1rem;
    width: 1rem;
    color: ${(props: Props) => svgColor[props.color]};
  }
`;

ButtonStyles.defaultProps = {
  theme: {
    blue: '#3f6ed4',
  },
};

const LinkStyles = styled.a`
  padding: 0.75rem 1.25rem;
  height: 2.625rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => bgColors[props.color]};
  color: ${(props: Props) => textColor[props.color]};
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.011em;
  line-height: 1;
  border: 1px solid ${(props: Props) => borderColor[props.color]};
  border-radius: 0.25rem;
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  cursor: pointer;

  &:hover:not(:disabled) {
    background-color: ${(props: Props) => hoverBg[props.color]};
  }

  &:focus {
    outline: none;
    box-shadow: ${(props: Props) => focusBoxShadow[props.color]};
    border-color: ${(props: Props) => focusBorder[props.color]};
  }

  svg {
    margin: 0 0.3125rem 0 0;
    height: 1rem;
    width: 1rem;
    color: ${(props: Props) => svgColor[props.color]};
  }
`;

LinkStyles.defaultProps = {
  theme: {
    blue: 'green',
  },
};

interface BaseProps {
  children: React.ReactNode;
  color: 'black' | 'white' | 'blue';
}

interface ButtonProps extends BaseProps {
  as: 'button';
  onClick?: () => void;
  type?: 'submit' | 'button' | 'reset';
  disabled?: boolean;
}

interface LinkProps extends BaseProps {
  as: 'a';
  href: string;
}

type Props = ButtonProps | LinkProps;

export default function Button(props: Props) {
  if (props.as === 'button')
    return <ButtonStyles {...props}>{props.children}</ButtonStyles>;
  if (props.as === 'a')
    return (
      <Link href={props.href} passHref>
        <LinkStyles {...props}>{props.children}</LinkStyles>
      </Link>
    );

  throw Error('Button requires an `as` prop that is either `button` or `a`.');
}
