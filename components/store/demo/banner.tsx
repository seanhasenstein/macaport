import React from 'react';
import styled from 'styled-components';

export default function DemoBanner() {
  React.useEffect(() => {
    document.body.style.paddingTop = '2.625rem';

    return () => {
      document.body.style.paddingTop = '0';
    };
  }, []);

  return (
    <DemoBannerStyles>
      <div className="banner-container">
        <p>This is a demo store</p>
      </div>
    </DemoBannerStyles>
  );
}

const DemoBannerStyles = styled.div`
  padding: 0;
  position: absolute;
  left: 0;
  top: 0;
  height: 2.625rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #265335;
  z-index: 9999;

  p {
    margin: 0;
    font-size: 0.8125rem;
    font-weight: 600;
    color: #f4faf6;
    text-align: center;
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: 0.2em;
  }
`;
