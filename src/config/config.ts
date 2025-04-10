interface Config {
  API_URL: string;
}

const config: Config = {
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:3001",
};

export default config;
