import { HttpHeaders } from '@angular/common/http';

// -----REPLACE BUILD_NUM-----
export const BUILD_NUMBER = 'tmt.int.--------.-';
// -----END REPLACE BUILD_NUM-----

// -----REPLACE API-----
export const BASE_URL = 'https://localhost:7085';
export const HEADERS = new HttpHeaders();
// -----END REPLACE API-----

// -----REPLACE AUTH REDIRECT-----
export const AUTH_REDIRECT_URL = '/'; //http://localhost:4200
// -----END REPLACE AUTH REDIRECT-----

// ----- AUTHENTICATION -----
export const AUTH_CLIENTID = '36a18388-ecf9-44b8-a73c-44628468dc84';
export const AUTH_AUTHORITY =
  'https://login.microsoftonline.com/71af4321-1f64-48f5-9b34-7bd6cbde463d';
export const AUTH_LOGOUT_REDIRECT = '/';

export const TMT_API_SCOPES = {
  readWrite: [
    'api://36a18388-ecf9-44b8-a73c-44628468dc84/TeamsMsgTestReadWrite',
  ],
};
