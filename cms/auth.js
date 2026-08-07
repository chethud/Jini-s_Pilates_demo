(() => {
  const SESSION_KEY = "jinis_cms_session";
  const COOKIE_NAME = "jinis_cms";
  const VALID_ID = "JINIS";
  const VALID_PASSWORD = "Jinni@7654";

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

  const setAuthed = (on) => {
    storageSet(window.sessionStorage, on);
    storageSet(window.localStorage, on);
    cookieSet(on);
  };

  const checkCredentials = (id, password) =>
    String(id || "").trim().toUpperCase() === VALID_ID &&
    String(password || "") === VALID_PASSWORD;

  window.JinisCMS = {
    isAuthed,
    setAuthed,
    checkCredentials,
    VALID_ID,
  };
})();
