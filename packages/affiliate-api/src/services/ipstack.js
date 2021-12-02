const axios = require('axios');
const IP_STACK_KEY = process.env.IP_STACK_API_KEY;

export const getLocationByIp = async (ip) => {
  const res = await axios.get(`http://api.ipstack.com/${ip}?access_key=${IP_STACK_KEY}`);
  return res.data;
};
