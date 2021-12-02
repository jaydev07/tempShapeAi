export const getUserPublicIP = (req) =>  {
	const forwardedHeader = req.headers.forwarded?.split(';').find(a => a.includes('for'))
	if (forwardedHeader) return forwardedHeader.split('=')[1];
	return req.ip.replace('::ffff:', '') ||
  (req.headers['x-forwarded-for'] || '').split(',').pop().trim()
  || req.connection.remoteAddress
  || req.socket.remoteAddress
  || req.connection.socket.remoteAddress; 
}
