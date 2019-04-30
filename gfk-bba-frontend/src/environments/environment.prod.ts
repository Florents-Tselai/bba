export const environment = {
  production: true,
  hmr: false,
  apiUrl: '',
  // apiUrl: 'http://51.15.215.167', - TODO - ein Versuch
  documentPollingTimer: 60000,
  ignoreHttpErrors: [0, 401],
};

export type Environment = typeof environment;
