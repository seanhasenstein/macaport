import React from 'react';
import {
  AddonItems,
  PersonalizationAddon,
  PersonalizationItem,
} from 'interfaces';
import { createInitialSubItem } from 'utils/personalization';

type Props = {
  addonItems: AddonItems;
  setAddonItems: React.Dispatch<React.SetStateAction<AddonItems>>;
  baseAddonItem: PersonalizationAddon;
  personalizationSubItem: PersonalizationItem;
  setLinesAvailable: React.Dispatch<React.SetStateAction<number>>;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
};

export default function usePersonalizationSubItemButtons(props: Props) {
  const [filteredSubItems, setFilteredSubItems] = React.useState<
    PersonalizationAddon[]
  >([]);

  React.useEffect(() => {
    const updatedSubItems = props.baseAddonItem.subItems.filter(
      subItem => subItem.itemId === props.personalizationSubItem.id
    );
    setFilteredSubItems(updatedSubItems);
  }, [props.baseAddonItem.subItems, props.personalizationSubItem.id]);

  const handleAddSubItem = () => {
    const updatedBaseAddonItem: PersonalizationAddon = {
      ...props.baseAddonItem,
      subItems: [
        ...props.baseAddonItem.subItems,
        createInitialSubItem(props.personalizationSubItem),
      ],
    };

    const updatedBaseAddonItems = props.addonItems[
      props.baseAddonItem.itemId
    ].map(addonItem => {
      if (addonItem.id === updatedBaseAddonItem.id) {
        return updatedBaseAddonItem;
      } else {
        return addonItem;
      }
    });

    const updatedAddonItems: AddonItems = {
      ...props.addonItems,
      [props.baseAddonItem.itemId]: updatedBaseAddonItems,
    };

    props.setAddonItems(updatedAddonItems);
    props.setLinesAvailable(
      prevState => prevState - props.personalizationSubItem.lines
    );
    props.setTotal(prevState => prevState + props.personalizationSubItem.price);
  };

  return { filteredSubItems, handleAddSubItem };
}
