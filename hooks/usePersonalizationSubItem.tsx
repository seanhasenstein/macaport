import { AddonItems, PersonalizationAddon } from 'interfaces';

type Props = {
  addonItems: AddonItems;
  setAddonItems: React.Dispatch<React.SetStateAction<AddonItems>>;
  baseAddonItem: PersonalizationAddon;
  subItem: PersonalizationAddon;
  setLinesAvailable: React.Dispatch<React.SetStateAction<number>>;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
};

export default function usePersonalizationSubItem(props: Props) {
  const handleValueChange = (value: string) => {
    const updatedSubItems = props.baseAddonItem.subItems.map(subItem => {
      if (subItem.id === props.subItem.id) {
        return { ...subItem, value };
      } else {
        return subItem;
      }
    });

    const updatedBaseAddonItem: PersonalizationAddon = {
      ...props.baseAddonItem,
      subItems: updatedSubItems,
    };
    const updatedBaseAddonItems = props.addonItems[
      props.baseAddonItem.itemId
    ].map(baseAddonItem => {
      if (baseAddonItem.id === updatedBaseAddonItem.id) {
        return updatedBaseAddonItem;
      } else {
        return baseAddonItem;
      }
    });
    const updatedAddonItems = {
      ...props.addonItems,
      [updatedBaseAddonItem.itemId]: updatedBaseAddonItems,
    };
    props.setAddonItems(updatedAddonItems);
  };

  const removeItem = () => {
    const updatedSubItems = props.baseAddonItem.subItems.filter(
      subItem => subItem.id !== props.subItem.id
    );
    const updatedBaseAddonItem: PersonalizationAddon = {
      ...props.baseAddonItem,
      subItems: updatedSubItems,
    };
    const updatedBaseAddonItems = props.addonItems[
      props.baseAddonItem.itemId
    ].map(baseAddonItem => {
      if (baseAddonItem.id === updatedBaseAddonItem.id) {
        return updatedBaseAddonItem;
      } else {
        return baseAddonItem;
      }
    });
    const updatedAddonItems = {
      ...props.addonItems,
      [updatedBaseAddonItem.itemId]: updatedBaseAddonItems,
    };
    props.setAddonItems(updatedAddonItems);
    props.setLinesAvailable(prevState => prevState + props.subItem.lines);
    props.setTotal(prevState => prevState - props.subItem.price);
  };

  return { handleValueChange, removeItem };
}
