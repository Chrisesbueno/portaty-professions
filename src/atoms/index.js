import { atom } from "recoil";

export const authSession = atom({
  key: "authSessionValue",
  default: false,
});
export const tagsList = atom({
  key: "tagsListValue",
  default: [],
});
export const keyImage = atom({
  key: "keyImageValue",
  default: "",
});
export const activitySelect = atom({
  key: "activitySelectValue",
  default: {},
});
export const mapBusiness = atom({
  key: "mapBusinessValue",
  default: {},
});
export const userAuthenticated = atom({
  key: "userAuthenticatedValue",
  default: null,
});
export const userTable = atom({
  key: "userTableValue",
  default: null,
});
export const userProfile = atom({
  key: "userProfileValue",
  default: [],
});
export const businessProfile = atom({
  key: "businessProfileValue",
  default: [],
});
export const searchStatus = atom({
  key: "searchStatusValue",
  default: false,
});
export const searchCache = atom({
  key: "searchCacheValue",
  default: [],
});
export const kmRadio = atom({
  key: "kmRadioValue",
  default: 1,
});
export const totalSearch = atom({
  key: "totalSearchValue",
  default: 2,
});

export const profileState = atom({
  key: "profileStateValue",
  default: false,
});
export const favoritesState = atom({
  key: "favoritesStateValue",
  default: false,
});
export const filterState = atom({
  key: "filterStateValue",
  default: 0.01,
});

export const mapUser = atom({
  key: "mapUserValue",
  default: null,
});
export const favoriteSelection = atom({
  key: "favoriteSelectionValue",
  default: [],
});
export const inputFavoritesSearch = atom({
  key: "inputFavoritesSearchValue",
  default: "",
});
export const urlInitalShare = atom({
  key: "urlInitalShareValue",
  default: {},
});
/* Code */
export const codeFields = atom({
  key: "codeFieldsValue",
  default: "",
});