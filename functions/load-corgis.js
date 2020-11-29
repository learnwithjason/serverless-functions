const fetch = require('node-fetch');

exports.handler = async () => {
  const corgis = await fetch(
    'https://no-cors-api.netlify.app/api/corgis/'
  ).then((res) => res.json());

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(corgis),
  };
};
