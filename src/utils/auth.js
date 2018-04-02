import Cookies from 'js-cookie'

// const TokenKey = 'okie'
const TokenKey = '.AspNet.ApplicationCookie'

export function getToken() {
  // console.log(Cookies);
  var value = Cookies.get(TokenKey)
  // console.log(value);
  // debugger;
  return value;
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
