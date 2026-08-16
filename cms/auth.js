(() => {
  const SESSION_KEY = "jinis_cms_session";
  const USER_KEY = "jinis_cms_user";
  const COOKIE_NAME = "jinis_cms";
  const ACCOUNTS = [
    { id: "Jinis", password: "Jinis@26" },
    { id: "chethan", password: "Che123@nd" },
  ];

  const cookieGet = () => {
    try {
      return document.cookie.split(";").some((part) => part.trim() === `${COOKIE_NAME}=1`);
    } catch {
      return false;
    }
  };

  const cookieSet = (on) => {
    try {
      if (on) {
        document.cookie = `${COOKIE_NAME}=1; path=/; max-age=86400; SameSite=Lax`;
      } else {
        document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
      }
    } catch {
      /* ignore */
    }
  };

  const storageGet = (store) => {
    try {
      return store.getItem(SESSION_KEY) === "1";
    } catch {
      return false;
    }
  };

  const storageSet = (store, on) => {
    try {
      if (on) store.setItem(SESSION_KEY, "1");
      else store.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  };

  const isAuthed = () =>
    storageGet(window.sessionStorage) ||
    storageGet(window.localStorage) ||
    cookieGet();

  const setAuthed = (on, userId) => {
    storageSet(window.sessionStorage, on);
    storageSet(window.localStorage, on);
    cookieSet(on);
    try {
      if (on && userId) {
        const name = String(userId).trim();
        window.sessionStorage.setItem(USER_KEY, name);
        window.localStorage.setItem(USER_KEY, name);
      } else if (!on) {
        window.sessionStorage.removeItem(USER_KEY);
        window.localStorage.removeItem(USER_KEY);
      }
    } catch {
      /* ignore */
    }
  };

  const currentUser = () => {
    try {
      return window.sessionStorage.getItem(USER_KEY) || window.localStorage.getItem(USER_KEY) || ACCOUNTS[0].id;
    } catch {
      return ACCOUNTS[0].id;
    }
  };

  const checkCredentials = (id, password) => {
    const name = String(id || "").trim().toLowerCase();
    const pass = String(password || "");
    return ACCOUNTS.some((account) => account.id.toLowerCase() === name && account.password === pass);
  };

  window.JinisCMS = {
    isAuthed,
    setAuthed,
    checkCredentials,
    currentUser,
  };
})();
