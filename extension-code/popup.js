import { detectHeaderIsSticky, initListItems, setInputListener } from './popupFunctions.js';

document.addEventListener('DOMContentLoaded', () => {
  initListItems();
  setInputListener();
  detectHeaderIsSticky();
});
