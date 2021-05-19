import Link from 'next/link';
import styled from 'styled-components';

const HeroStyles = styled.div`
  margin: 0 auto;
  padding: 5rem 0;
  width: 100%;
  max-width: 64rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .text-content {
    max-width: 32rem;
    width: 100%;
  }

  h1 {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 600;
    color: #111827;
  }

  p {
    margin: 1.125rem 0;
    font-size: 1.125rem;
    color: #6b7280;
    line-height: 1.625;
  }

  .btn {
    padding: 0.75rem 2rem;
    display: inline-flex;
    background-color: #22272f;
    color: rgba(2255, 255, 255, 0.9);
    font-size: 1rem;
    font-weight: 600;
    border-radius: 0.25rem;
  }

  .hero-img {
    max-width: 25rem;
    width: 100%;

    img {
      width: 100%;
    }
  }
`;

export default function Hero() {
  return (
    <HeroStyles>
      <div className="text-content">
        <h1>Welcome to Macaport</h1>
        <p>
          Located in New London, Wisconsin, we specialize in custom screen
          printing for fundraisers, family reunions, clubs, sports teams,
          special events, etc.
        </p>
        <Link href="#">
          <a className="btn">Learn More</a>
        </Link>
      </div>
      <div className="hero-img">
        <img
          src="/images/hero.jpg"
          alt="Hooded sweatshirt, t-shirt, and crewneck sweatshirt with Macaport logo"
        />
      </div>
    </HeroStyles>
  );
}
