module.exports = {
	env: {
		BASE_URL: process.env.NODE_ENV === 'development' ? 'localhost:3000' : 'in.now.sh'
	}
}