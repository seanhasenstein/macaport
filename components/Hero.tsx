import Link from 'next/link';
import styled from 'styled-components';

const HeroStyles = styled.div`
  padding: 0 1.5rem;

  .wrapper {
    margin: 0 auto;
    padding: 4rem 0;
    width: 100%;
    max-width: 65.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .text-content {
    padding: 0 2rem 0 0;
    max-width: 34rem;
    width: 100%;
  }

  h1 {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 600;
    color: #111827;
  }

  p {
    margin: 1.125rem 0 1.5rem;
    font-size: 1.125rem;
    color: #6b7280;
    line-height: 1.5;
  }

  .button {
    padding: 0.75rem 2rem;
    display: inline-flex;
    background-color: #253753;
    color: rgba(2255, 255, 255, 0.9);
    font-size: 1rem;
    font-weight: 500;
    letter-spacing: 0.025em;
    border-radius: 0.25rem;
    transition: all 150ms ease-in-out;

    &:hover {
      background-color: #2b4061;
      color: rgba(255, 255, 255, 1);
    }

    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
      box-shadow: rgb(255, 255, 255) 0px 0px 0px 2px, #2563eb 0px 0px 0px 4px,
        rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    }
  }

  .hero-img {
    max-width: 25rem;
    width: 100%;

    img {
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    .wrapper {
      flex-direction: column-reverse;
    }

    .hero-img {
      max-width: 18rem;
    }

    .text-content {
      margin: 1.5rem 0 0;
      text-align: center;
    }
  }
`;

export default function Hero() {
  return (
    <HeroStyles>
      <div className="wrapper">
        <div className="text-content">
          <h1>Welcome to Macaport</h1>
          <p>
            Located in New London, Wisconsin, we specialize in custom screen
            printing for fundraisers, family reunions, clubs, sports teams,
            special events, and more.
          </p>
          <Link href="/#colors">
            <a className="button">Learn More</a>
          </Link>
        </div>
        <div className="hero-img">
          <img
            src="/images/hero.jpg"
            alt="Hooded sweatshirt, t-shirt, and crewneck sweatshirt with Macaport logo"
          />
        </div>
      </div>
    </HeroStyles>
  );
}
