import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries.js';
const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const refs = {
    searchField: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};

refs.searchField.addEventListener('input', debounce(searchHandler, DEBOUNCE_DELAY));

function searchHandler(event) {
    const name = event.target.value.trim();
    let markup = '';

    if (!name) {
        countryListhMarkup();
        countryInfoMarkup();
        return;
    }

    fetchCountries(name)
        .then(data => {
            if (data.length > 10) {
                countryListhMarkup();
                countryInfoMarkup();

                Notify.info('Too many matches found. Please enter a more specific name.');
                return;
            }

            if (data.length > 1 && data.length <= 10) {
                countryInfoMarkup();

                markup = data.map(listOfCountriesMarkup).join('');
                countryListhMarkup(markup);
            }

            if (data.length === 1) {
                countryListhMarkup();

                markup = coutryDescriptionMarkup(data);
                countryInfoMarkup(markup);
            }
        })
        .catch(error => console.log("Oops, we have a problem: ", error));
}

function listOfCountriesMarkup(element) {
    return `<li class="country-list__item">
            <img class="image" src="${element.flags.svg}" alt="Country flag" 
                 width="40px" height="40px"/>
             <p class="text">${element.name.official}</p></li>`;
}

function coutryDescriptionMarkup(data) {
    let languagesArray = Object.values(data[0].languages);
    let languages = languagesArray.join(', ');
    return `<h1 class="heading">
             <img class="big-image" src="${data[0].flags.svg}" 
                 alt="Country flag" width="40px" height="40px"/>
                 ${data[0].name.official}</h1>
            <p class="text"><span class="text-heading">Capital:</span> ${data[0].capital}</p>
            <p class="text"><span class="text-heading">Population:</span> ${data[0].population}</p>
            <p class="text"><span class="text-heading">Languages:</span> ${languages}</p>`;
}

export function countryListhMarkup(markup = '') {
    return (refs.countryList.innerHTML = markup);
}

export function countryInfoMarkup(markup = '') {
    return (refs.countryInfo.innerHTML = markup);
}
