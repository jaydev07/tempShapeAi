import storage from "redux-persist/lib/storage/session";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import { createMigrate } from "redux-persist";

// The object key in this object would be the version number
// For example: the version 0 --> 0: state => {}
const migration = {
  0: (state) => ({
    ...state,
    userReducer: {
      token: state.userReducer.token,
      user: {
        _id: state.userReducer.user._id,
        profilePicture: {
          location: state.userReducer.user.profilePicture.location,
          key: state.userReducer.user.profilePicture.key,
        },
      },
      xp: state.userReducer.xp,
      loading: false,
    },
  }),
};

export const persistConfig = {
  key: "shapeAI",
  version: 0, // Version number
  debug: true,
  storage, // Assinging to session storage, this can be changed in the import above
  whitelist: ["userReducer", "bootcampReducer"], // Reducers mentioned here will be persisted
  blacklist: ["errorReducer"], // Reducers mentioned here will not be persisted
  stateReconciler: autoMergeLevel2,
  migrate: createMigrate(migration, { debug: true }),
};
