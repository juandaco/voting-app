const protocol = window.location.protocol;
const hostname = window.location.hostname;
const port = window.location.port;
const appURL = `${protocol}//${hostname}${port ? ':' + port : ''}`;
export default appURL;
