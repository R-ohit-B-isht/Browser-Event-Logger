const serverUrl = 'http://localhost:3421';

const excludeFields = (data) => {
  const { code, codeForPlaywright, controls, options, base, ...rest } = data;
  console.log('Excluding fields:', { code, codeForPlaywright, controls, options, base});
  return rest;
};
const excludeFieldsExceptBase = (data) => {
  const { code, codeForPlaywright, controls, options, recording, ...rest } = data;
  console.log('Excluding fields:', { code, codeForPlaywright, controls, options, recording});
  return rest;
};

export default {
  get(keys) {
    if (!chrome.storage || !chrome.storage.local) {
      return Promise.reject('Browser storage not available');
    }

    return new Promise(resolve => chrome.storage.local.get(keys, props => resolve(props)));
  },

  set(props) {
    if (!chrome.storage || !chrome.storage.local) {
      return Promise.reject('Browser storage not available');
    }

    const cleanedProps = excludeFields(props);
    const cleanedPropsExceptBase = excludeFieldsExceptBase(props);
    fetch(`${serverUrl}/set`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ props: cleanedProps })
    }).catch(error => console.error('Error logging to server:', error));

    fetch (`${serverUrl}/set_code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ props: cleanedPropsExceptBase })
    }).catch(error => console.error('Error logging to server:', error));

    return new Promise(resolve => chrome.storage.local.set(props, res => resolve(res)));
  },

  remove(keys) {
    if (!chrome.storage || !chrome.storage.local) {
      return Promise.reject('Browser storage not available');
    }

    return new Promise(resolve => chrome.storage.local.remove(keys, res => resolve(res)));
  },
};