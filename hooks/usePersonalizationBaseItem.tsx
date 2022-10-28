import { AddonItems, PersonalizationItem } from 'interfaces';
import { createId } from 'utils';

type Props = {
  personalizationItem: PersonalizationItem;
  addonItems: AddonItems;
  setAddonItems: React.Dispatch<React.SetStateAction<AddonItems>>;
  setLinesAvailable: React.Dispatch<React.SetStateAction<number>>;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
};

export default function usePersonalizationBaseItem(props: Props) {
  const initialAddonItem = {
    id: createId('base'),
    itemId: props.personalizationItem.id,
    addon: props.personalizationItem.name,
    value: '',
    name: props.personalizationItem.name,
    lines: props.personalizationItem.lines,
    limit: props.personalizationItem.limit,
    price: props.personalizationItem.price,
    location: props.personalizationItem.location,
    type: props.personalizationItem.type,
    list: props.personalizationItem.list,
    subItems: [],
  };

  const handleAddItemClick = () => {
    const updatedAddonItems: AddonItems = {
      ...props.addonItems,
      [props.personalizationItem.id]: [
        ...props.addonItems[props.personalizationItem.id],
        initialAddonItem,
      ],
    };
    props.setAddonItems(updatedAddonItems);
    props.setLinesAvailable(
      prevState => prevState - props.personalizationItem.lines
    );
    props.setTotal(prevState => prevState + props.personalizationItem.price);
  };

  const handleValueChange = (addonItemId: string, value: string) => {
    const updatedBaseItems = props.addonItems[props.personalizationItem.id].map(
      item => {
        if (item.id === addonItemId) {
          return { ...item, value };
        } else {
          return item;
        }
      }
    );
    const updatedAddonItems = {
      ...props.addonItems,
      [props.personalizationItem.id]: updatedBaseItems,
    };
    props.setAddonItems(updatedAddonItems);
  };

  const removeItem = (removedItemId: string) => {
    const removedItemIndex = props.addonItems[
      props.personalizationItem.id
    ].findIndex(item => item.id === removedItemId);
    const updatedBaseAddonItem = [
      ...props.addonItems[props.personalizationItem.id],
    ];
    updatedBaseAddonItem.splice(removedItemIndex, 1);
    const updatedAddonItems = {
      ...props.addonItems,
      [props.personalizationItem.id]: updatedBaseAddonItem,
    };
    const subItems = props.addonItems[props.personalizationItem.id][
      removedItemIndex
    ].subItems.reduce(
      (accumulator, currentSubItem) => {
        return {
          lines: accumulator.lines + currentSubItem.lines,
          total: accumulator.total + currentSubItem.price,
        };
      },
      { lines: 0, total: 0 }
    );
    props.setAddonItems(updatedAddonItems);
    props.setLinesAvailable(
      prevState => prevState + props.personalizationItem.lines + subItems.lines
    );
    props.setTotal(
      prevState => prevState - props.personalizationItem.price - subItems.total
    );
  };

  return { handleAddItemClick, handleValueChange, removeItem };
}
