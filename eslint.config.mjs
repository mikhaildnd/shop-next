import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    {
        plugins: {
            import: importPlugin,
            'simple-import-sort': simpleImportSort,
        },

        rules: {
            // Keep all imports at the top of the file.
            'import/first': 'error',

            // Prefer named exports over default exports.
            'import/no-default-export': 'error',

            // Disallow anonymous default exports.
            'import/no-anonymous-default-export': 'error',

            // Disabled in favor of eslint-plugin-simple-import-sort.
            'import/order': 'off',
            'sort-imports': 'off',

            // Enforce `import type` for type-only imports.
            '@typescript-eslint/consistent-type-imports': [
                'error',
                {
                    prefer: 'type-imports',
                    fixStyle: 'separate-type-imports',
                },
            ],

            // Automatically sort imports and exports.
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
        },
    },

    {
        files: [
            '**/page.tsx',
            '**/layout.tsx',
            '**/template.tsx',
            '**/loading.tsx',
            '**/error.tsx',
            '**/global-error.tsx',
            '**/not-found.tsx',
            '**/route.ts',

            'eslint.config.*',
            'next.config.*',
            'postcss.config.*',
            'prisma.config.*',
            'global.d.ts',
        ],

        rules: {
            // Next.js requires default exports for special route files.
            'import/no-default-export': 'off',
        },
    },

    // Override default ignores of eslint-config-next.
    globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);

export default eslintConfig;
