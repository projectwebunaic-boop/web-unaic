module.exports = {
    apps: [
        {
            name: "unaic-web",
            script: "node_modules/next/dist/bin/next",
            args: "start",
            instances: "max",
            exec_mode: "cluster",
            max_memory_restart: "1G", // Restart if RAM exceeds 1GB
            autorestart: true,
            watch: false,
            env: {
                NODE_ENV: "production",
                PORT: 3000
            }
        }
    ]
};
