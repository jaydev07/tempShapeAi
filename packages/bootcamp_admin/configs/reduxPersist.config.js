import storage from "redux-persist/lib/storage/session";

export const persistConfig = {
  key: "redux",
  storage,
  whitelist: ["courses", "user"],
  blacklist: [],
};
