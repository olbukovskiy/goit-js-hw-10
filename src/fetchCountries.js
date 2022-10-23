const END_POINT_URL = 'https://restcountries.com/v3.1';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { countryInfoMarkup } from './index';
import { countryListhMarkup } from './index';

export function fetchCountries(name) {
    return fetch(
        `${END_POINT_URL}/name/${name}?fields=name,capital,population,flags,languages`
    ).then(response => {
        if (!response.ok) {
            countryInfoMarkup();
            countryListhMarkup();
            throw new Error(Notify.failure('Oops, there is no country with that name'));
        }

        return response.json();
    });
}
