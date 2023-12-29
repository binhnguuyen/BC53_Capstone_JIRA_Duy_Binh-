export const setLocalStorage = (key, value) => localStorage.setItem(key, value);

export const getLocalStorage = (key) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
};