const Constants = {
  COLORS: ['#00C49F', '#FFBB28', '#0088FE', '#FF8042', '#9933FF'],
  BACKGROUND_TRANSPARENCY: 'rgba(255, 255, 255, 0.6)',
  BACKROUND_GRADIENT: "linear-gradient(135deg, rgba(66, 165, 245, 0.7), rgba(255, 167, 38, 0.7))",

  PROXY_HOST: 'travel-lab.dev',
  PROXY_PORT: '5173',

  // Import from env to avoid unnecessary discloure in version control
  AUTH0_DOMAIN: import.meta.env.VITE_AUTH0_DOMAIN,
  AUTH0_CLIENT: import.meta.env.VITE_AUTH0_CLIENT,
  AUTH0_AUDIENCE: import.meta.env.VITE_AUTH0_AUDIENCE,
};

export default Constants;
