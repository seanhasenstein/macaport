import React from 'react';
import {
  AddonItems,
  PersonalizationAddon,
  PersonalizationItem,
} from '../interfaces';

export default function useProductPersonalization(
  addons: PersonalizationItem[],
  maxLines: number
) {
  const [addonItems, setAddonItems] = React.useState<AddonItems>(() => {
    return addons.reduce((accumulator, currentAddonItem) => {
      return {
        ...accumulator,
        [currentAddonItem.id]: [],
      };
    }, {});
  });
  const [flattenedItems, setFlattendedItems] = React.useState<
    PersonalizationAddon[]
  >([]);
  const [linesAvailable, setLinesAvailable] = React.useState(Number(maxLines));
  const [total, setTotal] = React.useState(0);
  const [validationError, setValidationError] = React.useState<string>();
  const [addClickedWithBlankField, setAddClickedWithBlankField] =
    React.useState(false);

  React.useEffect(() => {
    if (addClickedWithBlankField) {
      const flattenedItems = Object.values(addonItems).flat();
      const stillHasBlankFields = flattenedItems.some(baseItem => {
        if (baseItem.value === '') {
          return true;
        }

        return baseItem.subItems.some(subItem => subItem.value === '');
      });

      if (!stillHasBlankFields) {
        setValidationError(undefined);
        setAddClickedWithBlankField(false);
      }
    }
  }, [addClickedWithBlankField, addonItems]);

  const reset = () => {
    const resetAddonItems = addons.reduce((accumulator, currentAddonItem) => {
      return {
        ...accumulator,
        [currentAddonItem.id]: [],
      };
    }, {});

    setAddonItems(resetAddonItems);
    setLinesAvailable(maxLines);
    setTotal(0);
    setAddClickedWithBlankField(false);
  };

  return {
    addonItems,
    setAddonItems,
    flattenedItems,
    setFlattendedItems,
    linesAvailable,
    setLinesAvailable,
    total,
    setTotal,
    validationError,
    setValidationError,
    addClickedWithBlankField,
    setAddClickedWithBlankField,
    reset,
  };
}
