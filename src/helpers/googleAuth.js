export const getGoogleAuthURL = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirectUri = encodeURIComponent(import.meta.env.VITE_GOOGLE_REDIRECT_URI);

  const scope = encodeURIComponent("openid email profile");

  return `
    https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}
    &redirect_uri=${redirectUri}
    &response_type=token
    &scope=${scope}
  `.replace(/\s+/g, "");
};