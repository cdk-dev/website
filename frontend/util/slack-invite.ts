export const getSlackFnUrl = async () => {
  const response = await fetch("config.json");
  const data = await response.json();
  return data.apiUrl;
}
