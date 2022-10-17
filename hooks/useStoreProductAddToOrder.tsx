import {
  AddonItems,
  CartItem,
  PersonalizationAddon,
  ProductColor,
  ProductSize,
  ProductSku,
} from 'interfaces';
import { createId } from 'utils';

interface Params {
  addItem: (item: CartItem) => void;
  productName: string;
  primaryImage: string | undefined;
  size: ProductSize;
  color: ProductColor;
  productSkus: ProductSku[];
  personalization: {
    addonItems: AddonItems;
    setValidationError: React.Dispatch<
      React.SetStateAction<string | undefined>
    >;
    setFlattendedItems: React.Dispatch<
      React.SetStateAction<PersonalizationAddon[]>
    >;
    setAddClickedWithBlankField: React.Dispatch<React.SetStateAction<boolean>>;
    total: number;
  };
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  setSizeValidationError: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
}

export default function useStoreProductAddToOrder(params: Params) {
  const handleAddToOrderClick = () => {
    if (params.size.label === 'DEFAULT') {
      params.setSizeValidationError('A size is required');
      return;
    }

    const sku = params.productSkus.find(
      sku =>
        sku.size.label === params.size.label && sku.color.id === params.color.id
    );

    // TODO: what does this do exactly?
    const flattenedPersonalizationAddonItems = Object.values(
      params.personalization.addonItems
    ).flat();

    // check for empty personalization items
    const hasEmptyAddonField = flattenedPersonalizationAddonItems.some(
      baseItem => {
        if (baseItem.value === '') {
          return true;
        }

        return baseItem.subItems.some(subitem => subitem.value === '');
      }
    );

    if (hasEmptyAddonField) {
      params.personalization.setValidationError(
        'Customization fields require values'
      );
      params.personalization.setAddClickedWithBlankField(true);
      return;
    }

    params.personalization.setFlattendedItems(
      flattenedPersonalizationAddonItems
    );

    const formattedAddonItems = flattenedPersonalizationAddonItems.map(
      baseAddonItem => {
        const { name, type, list, limit, subItems, ...restOfBaseItem } =
          baseAddonItem;

        const formattedSubItems = subItems.map(subItem => {
          const { name, type, list, limit, ...restofSubItem } = subItem;
          return restofSubItem;
        });

        return {
          ...restOfBaseItem,
          subItems: formattedSubItems,
        };
      }
    );

    if (sku)
      params.addItem({
        id: `${sku.id}-${createId(false, 5)}`,
        sku: sku,
        quantity: 1,
        name: params.productName,
        image: params.primaryImage,
        price: sku.size.price + params.personalization.total,
        personalizationAddons: formattedAddonItems,
      });

    params.setShowSidebar(true);
  };

  return handleAddToOrderClick;
}
