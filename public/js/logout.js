const logout = async () => {
  document.location.replace('/');
};

document.querySelector('#logout').addEventListener('click', logout);
