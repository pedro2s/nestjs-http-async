"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const config_1 = require("vitest/config");
const vite_tsconfig_paths_1 = tslib_1.__importDefault(require("vite-tsconfig-paths"));
exports.default = (0, config_1.defineConfig)({
    plugins: [(0, vite_tsconfig_paths_1.default)()],
    test: {
        globals: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
        },
        exclude: ['node_modules', 'dist', 'sample'],
    },
});
