const _fetch = async (path, options = {}) => {
  try {
    // options.credentials = 'include';
    const res = await fetch(`${URL}${path}`, options);
    
    if (res.status === 401 && !path.startsWith('/auth/')) {
      errorToast('Permission denied! Guests are not allowed to do this action.')
      logoutUser();
    }
    
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Error ${res.status}: ${text || res.statusText}`);
    }
    
    return res.json();
  } catch (err) {
    console.error('Request error:', err);
    throw err;
  }
};

const _post = (path, data) =>
  _fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

const _delete = (path) => _fetch(path, { method: 'DELETE' });
const toast = (message, variant = 'primary') => {
  const alert = Object.assign(document.createElement('sl-alert'), {
    variant,
    closable: true,
    duration: 4000,
    innerHTML: `<sl-icon slot="icon" name="info-circle"></sl-icon>${message}`,
  })
  
  document.body.appendChild(alert)
  alert.toast().then(() => { setTimeout(() => alert.remove(), 5000) })
}
const errorToast = (err) => {
  let message = 'Error! Something went wrong...';
  
  if (typeof err === 'string') {
    message = err;
  } else if (err && typeof err === 'object' && typeof err.message === 'string') {
    message = err.message;
  }
  
  return toast(message, 'danger');
}