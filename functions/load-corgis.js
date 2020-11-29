const fetch = require('node-fetch');

exports.handler = async () => {
  const corgis = await fetch(
    'https://no-cors-api.netlify.app/api/corgis/'
  ).then((res) => res.json());

  const unsplashPromise = fetch(
    'https://api.unsplash.com/collections/48405776/photos',
    {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    }
  ).then((res) => res.json());

  const [unsplashData] = await Promise.all([unsplashPromise]);

  const completeData = corgis.map((corgi) => {
    const photo = unsplashData.find((p) => corgi.id === p.id);

    return {
      ...corgi,
      alt: photo.alt_description,
      credit: photo.user.name,
      url: `${photo.urls.raw}&auto=format&fit=crop&w=300&h=300&q=80&crop=entropy`,
    };
  });

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(completeData),
  };
};
