type StoreReset = () => void;

const storeResets = new Set<StoreReset>();

export function registerStoreReset(reset: StoreReset): () => void {
  storeResets.add(reset);
  return () => {
    storeResets.delete(reset);
  };
}

export function resetAllStores(): void {
  storeResets.forEach((reset) => reset());
}
