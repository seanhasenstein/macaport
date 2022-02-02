import NextLink from 'next/link';
import styled from 'styled-components';

type Props = {
  href: string;
  label: string;
};

export default function LinkButton({ href, label }: Props) {
  return (
    <NextLink href={href} passHref>
      <LinkButtonStyles>{label}</LinkButtonStyles>
    </NextLink>
  );
}

const LinkButtonStyles = styled.a`
  padding: 0.75rem 1.25rem;
  height: 2.625rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #282d34;
  color: #f3f4f5;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.011em;
  line-height: 1;
  border: 1px solid #181a1e;
  border-radius: 0.25rem;
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  cursor: pointer;

  &:hover:not(:disabled) {
    background-color: #202329;
  }

  &:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
  }

  &:focus-visible {
    box-shadow: rgb(255, 255, 255) 0px 0px 0px 2px, #1f30c2 0px 0px 0px 4px,
      rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  }
`;
