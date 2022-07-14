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

export default function Colors() {
  return (
    <ColorsStyles>
      <div className="wrapper" id="colors">
        <h2>Ink Colors</h2>
        <p>
          These are the ink colors that we typically provide. Additional colors
          are available upon request.
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
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          Please note that these colors are general representations.
        </p>
      </div>
    </ColorsStyles>
  );
}

const ColorsStyles = styled.div`
  padding: 0 1.5rem;

  .wrapper {
    margin: 0 auto;
    padding: 4rem 0;
    max-width: 72rem;
    width: 100%;
    border-top: 1px solid #d1d5db;
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
      color: #374151;

      svg {
        margin-right: 0.375rem;
        height: 1rem;
        width: 1rem;
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

      svg {
        flex-shrink: 0;
        margin-top: 3px;
      }
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
    border: 1px solid rgba(0, 0, 0, 0.25);
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
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
