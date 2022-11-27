import styled from 'styled-components';

export default function DemoBanner() {
  return (
    <DemoBannerStyles>
      <div className="banner-container">
        <p>This is a demo (the store is currently closed)</p>
      </div>
    </DemoBannerStyles>
  );
}

const DemoBannerStyles = styled.div`
  padding: 1rem 2rem;
  position: fixed;
  left: 1.5rem;
  bottom: 1.5rem;
  width: calc(100% - 3rem);
  display: flex;
  justify-content: center;
  background-color: rgba(38, 83, 53, 0.95);
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  z-index: 9999;

  p {
    margin: 0;
    font-weight: 500;
    color: #fff;
    text-align: center;
    line-height: 1.5;
  }
`;
