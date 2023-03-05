import styled from 'styled-components';

export default function DemoBanner() {
  return (
    <DemoBannerStyles>
      <div className="banner-container">
        <p>This is a demo store</p>
      </div>
    </DemoBannerStyles>
  );
}

const DemoBannerStyles = styled.div`
  padding: 0.75rem 2rem 0.6875rem;
  position: absolute;
  left: calc(50% - 10rem);
  top: 5.25rem;
  width: 20rem;
  display: flex;
  justify-content: center;
  background-color: rgba(38, 83, 53, 0.93);
  border: 3px solid rgba(38, 83, 53, 1);
  border-radius: 0 0 0.625rem 0.625rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  z-index: 9999;

  p {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: #fff;
    text-align: center;
    line-height: 1.5;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  @media (max-width: 500px) {
    top: 4.75rem;
  }
`;
