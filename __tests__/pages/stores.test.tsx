import { StoreForStoresPage } from 'interfaces';
import { getServerSideProps } from '../../pages/stores';

describe('testing getServerSideProps', () => {
  test('', async () => {
    const fakeStores: StoreForStoresPage[] = [
      {
        _id: '1',
        name: 'Store 1',
        openDate: '',
        closeDate: '',
        permanentlyOpen: false,
        featuredImg: '',
      },
    ];

    const result = getServerSideProps({} as any);
    expect(result).toEqual(fakeStores);
  });
});
