import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    // Config bawaan Next.js + TypeScript
    ...compat.extends('next/core-web-vitals', 'next/typescript'),

    // Folder yang di-ignore
    {
        ignores: [
            'node_modules/**',
            '.next/**',
            'out/**',
            'build/**',
            'next-env.d.ts',
            'prisma/**',
            'app/generated/**',
        ],
    },

    // Custom rules
    {
        rules: {
            '@typescript-eslint/no-unused-expressions': [
                'warn',
                {
                    allowShortCircuit: true,
                    allowTernary: true,
                    allowTaggedTemplates: true,
                },
            ],
        },
    },
];

// ✅ Export variabel dengan nama
export default eslintConfig;
