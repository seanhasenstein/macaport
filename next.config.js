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
    ];
  },
};
