import 'zone.js/dist/zone-error';
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  hmr: true,
  apiUrl: 'http://localhost:3001',
  documentPollingTimer: 20000,
  ignoreHttpErrors: [0, 401],
};

export type Environment = typeof environment;

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// Included with Angular CLI.
