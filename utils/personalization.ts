import { PersonalizationAddon, PersonalizationItem } from 'interfaces';
import { createId } from 'utils';

export function createInitialSubItem(
  personalizationSubItem: PersonalizationItem
): PersonalizationAddon {
  const newItem = {
    id: createId('sub'),
    itemId: personalizationSubItem.id,
    addon: personalizationSubItem.name,
    value: '',
    name: personalizationSubItem.name,
    lines: personalizationSubItem.lines,
    limit: personalizationSubItem.limit,
    price: personalizationSubItem.price,
    type: personalizationSubItem.type,
    list: personalizationSubItem.list,
    location: personalizationSubItem.location,
    subItems: [],
  };

  return newItem;
}
