import { PersonalizationAddon } from 'interfaces';

// recursively creates an id with all personalization
// addon baseitems and subitems
export function getPersonalizationAddonsId(
  addonItems: PersonalizationAddon[]
): string {
  return addonItems.reduce((acc, currItem) => {
    if (currItem.subItems.length === 0) {
      return `${acc}${currItem.itemId}${currItem.value}`;
    }

    return `${acc}${currItem.itemId}${
      currItem.value
    }${getPersonalizationAddonsId(currItem.subItems)}`;
  }, '');
}
