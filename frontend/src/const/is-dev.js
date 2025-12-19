// Only treat explicit "true" as dev; any other value keeps production behavior (loader shown)
export const IS_DEV = process.env.REACT_APP_ISDEV === 'true';
