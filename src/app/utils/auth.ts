const saveJwtToken = (token: string) => {
    localStorage.setItem('jwtToken', token);
};

const getJwtToken = () => {
  //  return localStorage.getItem('jwtToken');
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('jwtToken');
  }
  return null;
};

const removeToken = () => {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('jwtToken');
  }
}

const logout = () => {
    removeToken();
    localStorage.removeItem('currentUser'); //for state management
    return true;
};

const isJwtTokenExpired = () => {
  const token = getJwtToken();

  if (!token) {
      // Token not found, consider it as expired
      return true;
  }

  const decodedToken = parseToken(token);
  const currentTimestamp = Math.floor(Date.now() / 1000);

  if (decodedToken.exp < currentTimestamp) {
      removeToken();
      return true;
  } else {
      return false;
  }
};
  
  const parseToken = (token: string) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      console.error('Error parsing token:', error);
      return {};
    }
  };

  const getJwtTokenData = () => {

    const token = getJwtToken();
  
    if (!token) {
      // Token not found, consider it as expired
      return false; //token expired
    }

    const decodedToken = parseToken(token);
    return decodedToken;
  };

  export {saveJwtToken, logout, isJwtTokenExpired, getJwtToken, getJwtTokenData}