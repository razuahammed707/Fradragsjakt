const storage = {
  getItem: (key) => {
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key, value) => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, value);
      } catch (error) {
        console.warn('Error setting localStorage key:', error);
      }
    }
  },
  removeItem: (key) => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        console.warn('Error removing localStorage key:', error);
      }
    }
  },
};

export default storage;
