import { API_VENDOR } from "common/constants/constants";
import { PAGE_LINK } from "common/constants/pagelinks";

export const navigateToScreen = (uri) => {
  window.location.replace(uri); // smthing like /dashboard
};
export const getToken = (type) => {

  if (type === API_VENDOR) {
    const token = JSON.parse(localStorage.getItem("enoviqToken"));
    return {access_token: token?.Access_Token, expired_at: token?.Token_Expire, refresh_token: token?.Refresh_Token};;
  }

  const oidcStorage = JSON.parse(
    localStorage.getItem(
      `oidc.user:${process.env.REACT_APP_AUTH_URL}:${process.env.REACT_APP_IDENTITY_CLIENT_ID}`
    )
  );
  return {access_token: oidcStorage?.access_token, expired_at: oidcStorage?.expired_at};
};

export const downloadFileOnClick = (url, fileName)=>{
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute(
    'download',
    fileName,
  );
  // Append to html link element page
  document.body.appendChild(link);
  // Start download
  link.click();
  // Clean up and remove the link
  link.parentNode.removeChild(link);
}

export const closeCurrentTab = ()=>{
  window.opener = null;
  window.open("", "_self");
  window.close();
}

const addSlashToString = (input)=>{
  input = input && input[input.length - 1] === '/' ? input : input+'/';
  input = input && input[0] === '/' ? input : '/'+input;

  return input;
}

export const isPrivateLink = (url)=>{
  if(!url.replaceAll(process.env.PUBLIC_URL,'').replaceAll('/','')) return false;
  url = addSlashToString(url);
  const arr = Object.values(PAGE_LINK);
  console.log("matchLinks123s", arr, url)
  const matchLinks = Object.values(PAGE_LINK).filter(page => url.includes(addSlashToString(page.NAME)));
  console.log("matchLinks", matchLinks)
  return matchLinks?.length > 0? matchLinks[0].PRIVATE : false;
}
