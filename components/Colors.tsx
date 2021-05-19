import styled from 'styled-components';

interface ColorProps {
  color: string;
}

const colors = [
  {
    id: 1,
    hex: '#ffffff',
    label: 'White',
  },
  {
    id: 2,
    hex: '#F60000',
    label: 'Scarlet',
  },
  {
    id: 3,
    hex: '#FF8C00',
    label: 'Orange',
  },
  {
    id: 4,
    hex: '#FFEE00',
    label: 'Lemon Yellow',
  },
  {
    id: 5,
    hex: '#FFBE0D',
    label: 'Gold',
  },
  {
    id: 6,
    hex: '#236923',
    label: 'Dark Green',
  },
  {
    id: 7,
    hex: '#3783FF',
    label: 'Royal',
  },
  {
    id: 8,
    hex: '#1C4280',
    label: 'Navy',
  },
  {
    id: 9,
    hex: '#4815AA',
    label: 'Purple',
  },
  {
    id: 10,
    hex: '#bbbbbb',
    label: 'Gray',
  },
  {
    id: 11,
    hex: '#6c4903',
    label: 'Brown',
  },
  {
    id: 12,
    hex: '#111111',
    label: 'Black',
  },
];

const ColorsStyles = styled.div`
  padding: 0 1.5rem;

  .wrapper {
    margin: 0 auto;
    padding: 4rem 0;
    max-width: 64rem;
    width: 100%;
    border-top: 1px solid #e5e7eb;
  }

  h2 {
    margin: 0 0 1rem;
    font-size: 1.5rem;
    font-weight: 600;
    color: #111827;
  }

  p {
    margin: 0;
    max-width: 40rem;
    font-size: 1rem;
    color: #6b7280;
    line-height: 1.625;

    &.note {
      font-size: 0.875rem;
      display: inline-flex;
      align-items: center;

      svg {
        margin-right: 0.3125rem;
        height: 1.0625rem;
        width: 1.0625rem;
        color: #9ca3af;
      }
    }
  }

  .color-list {
    margin: 0;
    padding: 2.5rem 0;
    max-width: 41rem;
    width: 100%;
    min-width: 0;
    flex: 1 1 0%;
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 1.25rem 1rem;
    list-style-type: none;
  }

  @media (max-width: 500px) {
    .color-list {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    p.note {
      align-items: flex-start;
    }
  }
`;

const Color = styled.li<ColorProps>`
  max-width: 6rem;
  width: 100%;

  span {
    height: 2.5rem;
    width: 100%;
    display: block;
    background-color: ${props => props.color};
    border-radius: 0.375rem;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
  }

  p {
    margin: 0.25rem 0 0;
    font-size: 0.75rem;
    text-align: center;
    color: #374151;
  }

  @media (max-width: 500px) {
    max-width: 100%;
    display: grid;
    grid-template-columns: 5rem 1fr;
    align-items: center;

    p {
      margin: 0 0 0 1rem;
      text-align: left;
    }
  }
`;

export default function Colors() {
  return (
    <ColorsStyles>
      <div className="wrapper">
        <h2>Ink Colors</h2>
        <p>
          These are the ink colors that we typically provide. However,
          additional colors are available upon request.
        </p>
        <ul className="color-list">
          {colors.map(c => (
            <Color key={c.id} color={c.hex}>
              <span className="color" />
              <p>{c.label}</p>
            </Color>
          ))}
        </ul>
        <p className="note">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Please note that these colors are general representations.
        </p>
      </div>
    </ColorsStyles>
  );
}
