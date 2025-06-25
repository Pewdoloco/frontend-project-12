import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginReactRefresh from 'eslint-plugin-react-refresh'
import pluginNode from 'eslint-plugin-n'
import { includeIgnoreFile } from '@eslint/compat'
import stylistic from '@stylistic/eslint-plugin'
import { fileURLToPath } from 'url'

const gitIgnorePath = fileURLToPath(new URL('.gitignore', import.meta.url))

export default [
  includeIgnoreFile(gitIgnorePath),
  {
    files: ['**/*.{js,jsx}'],
    ignores: ['dist/**', 'node_modules/**', 'sourceMaps/**'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      'react': pluginReact,
      'react-hooks': pluginReactHooks,
      'react-refresh': pluginReactRefresh,
      '@stylistic': stylistic,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': 'warn',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      ...stylistic.configs.recommended.rules,
      '@stylistic/comma-dangle': ['error', 'only-multiline'],
    },
    settings: {
      react: {
        version: '19.1.0',
      },
    },
  },
  {
    files: ['vite.config.js', 'upload-source-maps.{js,cjs}'],
    plugins: {
      n: pluginNode,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        __dirname: true,
        process: true,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'script',
      },
    },
    rules: {
      ...pluginNode.configs.recommended.rules,
    },
  },
]
