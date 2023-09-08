const Constants = {
  COLORS: ['#00C49F', '#FFBB28', '#0088FE', '#FF8042', '#9933FF'],

  API_HOST: 'travel-lab.dev',
  API_PORT: '8000',

  // Import from env to avoid unnecessary discloure in version control
  AUTH0_DOMAIN: import.meta.env.VITE_AUTH0_DOMAIN,
  AUTH0_CLIENT: import.meta.env.VITE_AUTH0_CLIENT,
  AUTH0_AUDIENCE: import.meta.env.VITE_AUTH0_AUDIENCE,
};

export default Constants;
