module.exports = {
  compiler: {
    // ssr and displayName are configured by default
    styledComponents: true,
  },
  async redirects() {
    return [
      {
        source: '/lhscc',
        destination: '/store/689f2b9aab35069ae78bb4e9',
        permanent: false, // This makes it a temporary redirect (302)
      },
      // The Sheboygan Lutheran-hosted cross country sectional, named to match
      // the "I ♥ CC" apparel. Temporary so the name can point at next year's
      // store without browsers holding on to this one.
      {
        source: '/cc-sectional',
        destination: '/store/6ac661d41d6aa498ace999e4',
        permanent: false,
      },
      // Renamed to /terms-of-service, which is the US convention for a site
      // people use rather than a retail catalogue. Permanent because the old
      // address has been the one in the footer for years and may be linked
      // from anywhere — a 301 keeps those links working and tells search
      // engines which page replaced it.
      {
        source: '/terms-and-conditions',
        destination: '/terms-of-service',
        permanent: true,
      },
    ];
  },
};
