export const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export function get(url) {
  return new Promise(resolve => {
    setTimeout(
      () => {
        fetch(`${baseUrl}/${url}`)
          .then(x => x.json())
          .then(resolve);

      },
      1000
    )
  });
}


export function post(url, data) {
  return new Promise(resolve => {
    fetch(`${baseUrl}/${url}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(x => x.json())
      .then(resolve);
  });
}

