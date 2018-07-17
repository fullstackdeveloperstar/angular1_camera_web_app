import imageStoreMockup from './imageStoreMockup';

const useStoreMockup = false;

export default function imageStoreService() {
  let store = useStoreMockup ? imageStoreMockup : [];

  const getStore = () => store;

  const add = (...images) => {
    store = [...store, ...images];
    return store.length;
  };

  const remove = (id) => {
    store = store.filter(o => o.id !== id);
    return store.length;
  };

  const reset = () => {
    store = [];
  };

  const get = (id) => {
    return store.find(o => o.id === id);
  };

  const at = (i) => {
    return store[(i < 0) ? getStore().length + i : i];
  };

  const length = () => store.length;

  const update = (id, o) => {
    store = store.map((image) => {
      if (image.id !== id) {
        return image;
      }

      return { ...image, ...o };
    });
  }

  return {
    store,
    getStore,
    add,
    remove,
    reset,
    get,
    at,
    length,
    update,
  };
}
