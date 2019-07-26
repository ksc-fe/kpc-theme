module.exports = function(api) {
    api.cache(true);

    const config = {
        "presets": [
            ["@babel/preset-env", {
                "targets": {
                    "browsers": [
                        "last 2 versions"
                    ]
                },
                "modules": "cjs",
            }]
        ],
        "plugins": [
            "@babel/plugin-transform-runtime",
            ["@babel/plugin-proposal-decorators", {"legacy": true}],
            "@babel/plugin-proposal-class-properties",
            "@babel/plugin-syntax-dynamic-import",
            "@babel/plugin-proposal-do-expressions",
        ]
    };

    return config;
}
