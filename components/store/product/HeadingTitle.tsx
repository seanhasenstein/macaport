import React from 'react';
import styled from 'styled-components';

type Props = {
  children: React.ReactNode;
};

export default function HeadingTitle(props: Props) {
  return <HeadingTitleStyles>{props.children}</HeadingTitleStyles>;
}

const HeadingTitleStyles = styled.h4`
  margin: 0 0 1rem;
  font-weight: 500;
  font-size: 1rem;
  color: #111827;
`;
