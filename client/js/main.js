"use strict";

import App from './app.js';

// getting the two containers
const mainContainer = document.querySelector('#main-container');
//const pageTitle = document.querySelector('#filter-title');
const sidebarContainer = document.querySelector('#left-sidebar');
const dropdownSearch = document.querySelector('#menu-search');


const app = new App(mainContainer, sidebarContainer, dropdownSearch);