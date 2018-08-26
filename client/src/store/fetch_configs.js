import cloneDeep from 'lodash/cloneDeep';
import isNil from 'lodash/isNil';

export const deleteConfig = () => {
    return (
        {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
    );
};

export const getConfig = () => {
    return (
        {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }
    );
};

export const patchConfig = (postData) => {
    return (
        {
            method: 'PATCH',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(postData)
        }
    );
};

export const postConfig = (postData) => {
    return (
        {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(postData)
        }
    );
};

export const fetcher = (apiUrl, config) => {
    let response;
    return new Promise( (resolve, reject) => {
      fetch(apiUrl, config)
        .then(r => {
          response = r;
  
          if (response.ok) {
            // If the response is ok (2xx response code), decode it and pass it on
            return response.json();
          }
          else {
            // If there is a non-2xx code, we need the text to show the user what the error was
            return response.text();
          }
        })
        .then(data => {
          if (!response.ok) {
            // Now that we have the text, throw the error
            const error = new Error(`${response.status} ${response.statusText}: ${data}`)
            error.response = response;
            throw error;
          }
  
          resolve(data);
        })
        .catch(err => {
          reject(err);
        });
    });
};

export const withAuthToken = (fetchOpts, state) => {
    const authToken = state.auth;
    let fetchOptsWithAuth = cloneDeep(fetchOpts);

    fetchOptsWithAuth.headers = fetchOptsWithAuth.headers || {};

    if (!isNil(authToken)) {
        fetchOptsWithAuth.headers.Authorization = `Token ${authToken}`;
    }

    return fetchOptsWithAuth;
};