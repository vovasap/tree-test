import { globalIgnores } from 'eslint/config'
import {
  defineConfigWithVueTs, vueTsConfigs,
} from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginOxlint from 'eslint-plugin-oxlint'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  pluginVue.configs['flat/strongly-recommended'],
  vueTsConfigs.recommended,
  ...pluginOxlint.configs['flat/recommended'],

  {
    rules: {
      'semi': ['warn', 'never'],
      'quotes': ['warn', 'single'],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-newline': 'warn',
      'vue/attributes-order': 'error',
    },
  },
)
