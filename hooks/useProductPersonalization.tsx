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
    reset,
  };
}
