import styled from 'styled-components';
import { CartItem } from '../../interfaces';
import { formatToMoney } from '../../utils';

export default function CheckoutItem({ item }: { item: CartItem }) {
  return (
    <CheckoutItemStyles>
      <div className="image">
        <img src={item.image} alt={`${item.sku.color.label} ${item.name}`} />
      </div>
      <div className="name">{item.name}</div>
      <div className="total">{formatToMoney(item.itemTotal!)}</div>
      <div className="details">
        <div className="detail">
          <span className="label">Color:</span>
          <span className="value">{item.sku.color.label}</span>
        </div>
        <div className="detail">
          <span className="label">Size:</span>
          <span className="value">{item.sku.size.label}</span>
        </div>
        {item.personalizationAddons.length > 0 ? (
          <div className="personalization">
            <div className="addon-label">Addons:</div>
            <div className="addon-items">
              {item.personalizationAddons.map(item => (
                <div key={item.id} className="addon-item">
                  {item.value}
                  {item.subItems.map(subItem => (
                    <div key={subItem.id} className="subitem">
                      {subItem.value}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <div className="detail quantity">
        Qty: <span className="value">{item.quantity}</span>
      </div>
    </CheckoutItemStyles>
  );
}

const CheckoutItemStyles = styled.div`
  position: relative;
  width: 100%;
  padding: 1.5rem 0;
  display: grid;
  grid-template-areas:
    'image name total'
    'image color .'
    'image size quantity';
  grid-template-columns: 4rem 1fr 3rem;
  gap: 0 1rem;
  border-bottom: 1px solid #e5e7eb;

  &:first-of-type {
    border-top: 1px solid #e5e7eb;
  }

  .image {
    grid-area: image;

    img {
      width: 100%;
      padding: 0.25rem;
      background-color: #fff;
      border-radius: 0.375rem;
      border: 1px solid #e5e7eb;
      box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
        rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    }
  }

  .name,
  .total {
    color: #111827;
  }

  .name {
    grid-area: name;
    font-weight: 500;
  }

  .total {
    grid-area: total;
    text-align: right;
    font-weight: 600;
  }

  .detail {
    margin: 0.3125rem 0 0;
    font-size: 0.875rem;
    color: #111827;

    .label {
      margin: 0 0.375rem 0 0;
      display: inline-block;
      color: #6b7280;
    }
  }

  .personalization {
    margin: 0.3125rem 0 0;
    display: flex;
  }

  .addon-label {
    margin: 0 0.375rem 0 0;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .addon-item {
    margin: 0.25rem 0 0;
    font-size: 0.875rem;
    color: #111827;

    &:first-of-type {
      margin: 0;
    }
  }

  .subitem {
    margin: 0.25rem 0 0;
  }

  .size {
    grid-area: size;
    display: flex;
    align-items: flex-end;
    font-size: 0.875rem;
    color: #4b5563;
  }

  .quantity {
    grid-area: quantity;
    position: absolute;
    bottom: 0;
    right: 0;
  }

  @media (max-width: 450px) {
    grid-template-areas:
      'image name'
      'image total'
      'image quantity'
      'image color'
      'image size';
    grid-template-columns: 4rem 1fr;

    .total {
      margin: 0.25rem 0 0;
      text-align: left;
      font-weight: 500;
    }

    .quantity {
      position: static;
    }
  }
`;
