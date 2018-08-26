const STORAGE_PREFIX = 'ticker_storage';

const generate_storage_key = (key) => `${STORAGE_PREFIX}_${key}`;

export const loadSetting = (key) => {
  const storedData = localStorage.getItem(generate_storage_key(key));

  if (storedData) {
    return JSON.parse(storedData);
  }

  return null;
};

export const saveSetting = (key, newData) => {
  localStorage.setItem(generate_storage_key(key),  JSON.stringify(newData));
};

export const removeSetting = (key, newData) => {
  localStorage.removeItem(generate_storage_key(key));
};