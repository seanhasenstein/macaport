import React from 'react';
import { useRouter } from 'next/router';
import { ProductColor, ProductSize } from 'interfaces';
import { defaultSize } from 'utils/store';

interface Params {
  error: string | undefined;
  productColors: ProductColor[];
  selectedColor: ProductColor;
  storeId: string;
  productId: string;
  setSize: React.Dispatch<React.SetStateAction<ProductSize>>;
  setShowLightbox: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function useStoreProductImages(params: Params) {
  const router = useRouter();
  const [primaryImage, setPrimaryImage] = React.useState(() => {
    if (params.error) return 'error';
    const c = params.productColors.find(c => c.id === params.selectedColor.id);
    return c?.primaryImage;
  });
  const [secondaryImages, setSecondaryImages] = React.useState(() => {
    if (params.error) return ['error'];
    const c = params.productColors.find(c => c.id === params.selectedColor.id);
    return c?.secondaryImages;
  });
  const [clickedImage, setClickedImage] = React.useState('image-0');

  React.useEffect(() => {
    if (params.error) return;

    router.push(
      `/store/${params.storeId}/${
        router.pathname.split('/').includes('demo') ? 'demo/' : ''
      }product?productId=${params.productId}&colorId=${
        params.selectedColor.id
      }`,
      undefined,
      { shallow: true }
    );

    setPrimaryImage(() => {
      const c = params.productColors.find(
        c => c.id === params.selectedColor.id
      );
      return c?.primaryImage;
    });

    setSecondaryImages(() => {
      const c = params.productColors.find(
        c => c.id === params.selectedColor.id
      );
      return c?.secondaryImages;
    });

    params.setSize(defaultSize);
  }, [
    params.selectedColor.id,
    params.error,
    params.productColors,
    params.productId,
    params.storeId,
  ]);

  const handleImageClick = (imageIndex: string) => {
    setClickedImage(imageIndex);
    params.setShowLightbox(true);
  };

  return { primaryImage, secondaryImages, clickedImage, handleImageClick };
}
