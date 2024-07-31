import { BrowserCacheLocation, Configuration } from '@azure/msal-browser';
import {
  AUTH_AUTHORITY,
  AUTH_CLIENTID,
  AUTH_LOGOUT_REDIRECT,
  AUTH_REDIRECT_URL,
  BASE_URL,
  TMT_API_SCOPES,
} from './app/core/constants';

const isIE =
  window.navigator.userAgent.indexOf('MSIE ') > -1 ||
  window.navigator.userAgent.indexOf('Trident/') > -1;

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export const msalConfig: Configuration = {
  auth: {
    clientId: AUTH_CLIENTID, // This is the ONLY mandatory field that you need to supply.
    authority: AUTH_AUTHORITY, // Defaults to "https://login.microsoftonline.com/common"
    redirectUri: AUTH_REDIRECT_URL, // Points to window.location.origin by default. You must register this URI on Azure portal/App Registration.
    postLogoutRedirectUri: AUTH_LOGOUT_REDIRECT, // Points to window.location.origin by default.
    clientCapabilities: ['CP1'], // This lets the resource server know that this client can handle claim challenges.
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage, // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
    storeAuthStateInCookie: isIE, // Set this to "true" if you are having issues on IE11 or Edge. Remove this line to use Angular Universal
  },
};

/**
 * Add here the endpoints and scopes when obtaining an access token for protected web APIs. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const protectedResources = {
  tmtAPI: {
    endpoint: BASE_URL + '/api',
    scopes: TMT_API_SCOPES,
  },
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
  scopes: [],
};
