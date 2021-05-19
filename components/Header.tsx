import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

type NavItemProps = {
  text: string;
  href: string;
};

function NavItem({ text, href }: NavItemProps) {
  return (
    <li>
      <Link href={href}>
        <a>{text}</a>
      </Link>
    </li>
  );
}

const HeaderStyles = styled.header`
  margin: 0 auto;
  padding: 0.75rem 0;
  width: 100%;
  background-color: #fff;
  box-shadow: rgb(255, 255, 255) 0px 0px 0px 0px,
    rgba(17, 24, 39, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;

  .wrapper {
    margin: 0 auto;
    max-width: 64rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    width: 16rem;

    img {
      width: 100%;
    }
  }

  nav {
    ul {
      display: flex;
      list-style-type: none;
    }

    li {
      padding: 0 2rem;

      &:last-of-type {
        padding-right: 0;
      }
    }

    a {
      font-size: 1rem;
      font-weight: 500;
      color: #3f4a5d;

      &:hover {
        color: #07090b;
      }
    }
  }
`;

export default function Header() {
  return (
    <HeaderStyles>
      <div className="wrapper">
        <div className="logo">
          <img src="/images/logo.png" alt="Macaport logo with mountains" />
        </div>
        <nav>
          <ul>
            <NavItem text="Ink Colors" href="#ink-colors" />
            <NavItem text="Prices" href="#prices" />
            <NavItem text="Contact" href="#contact" />
          </ul>
        </nav>
      </div>
    </HeaderStyles>
  );
}
