import React from 'react';
import styled from 'styled-components';

type Props = {
  setShowLightbox: (b: boolean) => void;
  primaryImage: string;
  primaryAlt: string;
  secondaryImages: string[] | undefined;
  clickedImage: string;
};

export default function Lightbox({
  setShowLightbox,
  primaryImage,
  primaryAlt,
  secondaryImages,
  clickedImage,
}: Props) {
  const closeButton = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    const handleKeyup = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowLightbox(false);
        return;
      }
    };

    closeButton?.current && closeButton.current.focus();
    document.body.style.overflow = 'hidden';
    document.body.addEventListener('keyup', handleKeyup);
    const image = document.querySelector(`#${clickedImage}`);
    image?.scrollIntoView();

    return () => {
      document.body.style.overflow = 'inherit';
      document.body.removeEventListener('keyup', handleKeyup);
    };
  }, [clickedImage, setShowLightbox]);

  return (
    <LightboxStyles>
      <button
        ref={closeButton}
        className="close-button"
        onClick={() => setShowLightbox(false)}
      >
        <span className="sr-only">Close Gallery</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <div className="images">
        <div className="img" id="image-0">
          <img src={primaryImage} alt={primaryAlt} />
        </div>
        {secondaryImages?.map((image, i) => (
          <div key={image} className="img" id={`image-${i + 1}`}>
            <img src={image} alt={'TODO'} />
          </div>
        ))}
      </div>
    </LightboxStyles>
  );
}

const LightboxStyles = styled.div`
  position: fixed;
  overflow-y: scroll;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #fff;

  .close-button {
    position: fixed;
    top: 1.5rem;
    right: 1.5rem;
    padding: 0;
    color: #000;
    border: none;
    background-color: transparent;
    cursor: pointer;

    svg {
      height: 1.75rem;
      width: 1.75rem;
      color: #000;
    }
  }

  .images {
    margin: 0 auto;
    padding: 0 3.5rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .img {
      margin: 2rem 0;
      max-width: 30rem;
      width: 100%;
      background-color: #fff;

      img {
        width: 100%;
      }
    }
  }

  @media (max-width: 500px) {
    .images .img {
      margin: 3.5rem 0;
    }
  }
`;
