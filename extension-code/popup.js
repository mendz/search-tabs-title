import {initListItems, setInputListener} from "./popupFunctions.js";

/* globals chrome */

document.addEventListener('DOMContentLoaded', () => {
  initListItems();
  setInputListener();
});
