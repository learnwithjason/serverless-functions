const fetch = require('node-fetch');
const { hasuraRequest } = require('./util/hasura');

exports.handler = async () => {
  const corgis = await fetch(
    'https://no-cors-api.netlify.app/api/corgis/',
  ).then((res) => res.json());

  const data = await hasuraRequest({
    query: `
      mutation InsertOrUpdateBoops($corgis: [boops_insert_input!]!) {
        boops: insert_boops(objects: $corgis, on_conflict: {constraint: boops_pkey, update_columns: id}) {
          returning {
            count
            id
          }
        }
      }
    `,
    variables: {
      corgis: corgis.map(({ id }) => ({ id, count: 0 })),
    },
  });

  const corgisWithBoops = corgis.map((corgi) => {
    const boops = data.boops.returning.find((b) => b.id === corgi.id);

    return {
      ...corgi,
      boops: boops.count,
    };
  });

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(corgisWithBoops),
  };
};
