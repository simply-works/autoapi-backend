module.exports = {
	apps: [{
		name: 'autoapi-backend',
		script:'npm',
		args : ["start"],
		instances: 1,
		exec_mode: 'cluster',
		autorestart: true,
		max_memory_restart: '500M',
		restart_delay: 3000
	}]
}

// log file size can be set by following command 
//pm2 set pm2-logrotate:max_size 1K