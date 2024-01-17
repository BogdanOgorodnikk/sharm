/**
 *
 * This methods extends the default HTML5 Storage object and add support
 * to set and get multidimensional data
 *
 * @example Storage.setObj('users.albums.sexPistols',"blah");
 * @example Storage.setObj('users.albums.sexPistols',{ sid : "My Way", nancy : "Bitch" });
 * @example Storage.setObj('users.albums.sexPistols.sid',"Other songs");
 *
 * @example Storage.getObj('users');
 * @example Storage.getObj('users.albums');
 * @example Storage.getObj('users.albums.sexPistols');
 * @example Storage.getObj('users.albums.sexPistols.sid');
 * @example Storage.getObj('users.albums.sexPistols.nancy');
 *
 */

const Storage = {
  __walker(path, o) {
    //Validate if path is an object otherwise returns false
    if (typeof path !== "object") {
      return undefined;
    }

    if (path.length === 0) {
      return o;
    }

    for (var i in path) {
      let prop = path[i];

      //Check if path step exists
      if (Object.prototype.hasOwnProperty.call(o, prop)) {
        let val = o[prop];

        if (typeof val == "object") {
          path.splice(0, 1);

          return this.__walker(path, val);
        } else {
          return val;
        }
      }
    }
  },

  setObj(key, value) {
    let path = key.split(".");

    //First level is always the localStorage key pair item
    let _key = path[0];
    const storage = window.localStorage;
    const item = storage.getItem(_key);

    let os = this.isJsonString(item) ? JSON.parse(storage.getItem(_key)) : null; //general storage key pair element

    path.splice(0, 1);

    if (os === null) {
      os = {};
      storage.setItem(_key, JSON.stringify(os));
    }

    let innerWalker = function (path, o) {
      //Validate if path is an object otherwise returns false
      if (typeof path !== "object") {
        return undefined;
      }

      if (path.length == 1) {
        o[path[0]] = value;

        return o;
      } else if (path.length === 0) {
        os = value;

        return os;
      }

      let val = null;

      for (let i in path) {
        let prop = path[i];

        //Check if path step exists
        if (Object.prototype.hasOwnProperty.call(o, prop)) {
          val = o[prop];

          if (typeof val == "object") {
            path.splice(0, 1);

            return innerWalker(path, val);
          }
        } else {
          //create depth
          o[prop] = {};
          val = o[prop];
          path.splice(0, 1);

          return innerWalker(path, val);
        }
      }
    };

    innerWalker(path, os);

    storage.setItem(_key, JSON.stringify(os));
  },

  getObj(key) {
    key = key.split(".");

    //First level is always the localStorage key pair item
    let _key = key[0];
    const storage = window.localStorage;
    const item = storage.getItem(_key);

    let o = this.isJsonString(item) ? JSON.parse(item) : null;

    if (o === null) {
      return undefined;
    }

    key.splice(0, 1);

    return this.__walker(key, o);
  },

  isJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }

    return true;
  },

  removeObj(key) {
    localStorage.removeItem(key);
  },
};

export default Storage;
