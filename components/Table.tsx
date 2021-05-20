import styled from 'styled-components';

const TableStyles = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    tr {
      box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
        rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
        rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
    }
  }

  th {
    padding: 0.75rem 0;
    font-size: 0.75rem;
    font-weight: 500;
    color: #d1d5db;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background-color: #1f2937;
    border-right: 1px solid #374151;

    &:first-of-type {
      padding-left: 1.25rem;
      text-align: left;
      border-top-left-radius: 0.25rem;
      border-bottom-left-radius: 0.25rem;
    }

    &:last-of-type {
      border-top-right-radius: 0.25rem;
      border-bottom-right-radius: 0.25rem;
      border-right: none;
    }
  }

  tbody tr:nth-of-type(even) {
    background-color: #f3f4f6;
    border-radius: 0.25rem;
  }

  td {
    padding: 0.5rem 0;
    font-size: 0.9375rem;
    color: #374151;
    text-align: center;
    border-right: 1px solid #e5e7eb;

    &:first-of-type {
      padding-left: 1.25rem;
      text-align: left;
    }

    &:last-of-type {
      border-right: none;
    }
  }
`;

type TableProps = {
  data: any[];
  columns: string[];
};

export default function Table({ data, columns }: TableProps) {
  return (
    <TableStyles>
      <thead>
        <tr>
          {columns.map(heading => (
            <th key={heading}>{heading}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map(item => (
          <tr key={item.id}>
            {columns.map(heading => (
              <td key={heading}>{item[heading]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </TableStyles>
  );
}
