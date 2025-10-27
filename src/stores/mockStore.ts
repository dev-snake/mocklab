import { create } from 'zustand';
import { generateMockData } from '@/core/utils/mock-generator';
import type { FieldSchema, GeneratorOptions } from '@/core/utils/mock-generator';

interface MockStore {
    schema: FieldSchema[];
    generatedData: any[];
    generatorOptions: GeneratorOptions;

    setSchema: (schema: FieldSchema[]) => void;
    addField: (field: FieldSchema) => void;
    updateField: (id: string, field: Partial<FieldSchema>) => void;
    removeField: (id: string) => void;
    setGeneratorOptions: (options: Partial<GeneratorOptions>) => void;
    generateData: () => void;
    clearData: () => void;
}

export const useMockStore = create<MockStore>((set, get) => ({
    schema: [],
    generatedData: [],
    generatorOptions: {
        type: 'realistic',
        count: 10,
    },

    setSchema: (schema) => set({ schema }),

    addField: (field) =>
        set((state) => ({
            schema: [...state.schema, field],
        })),

    updateField: (id, field) =>
        set((state) => ({
            schema: state.schema.map((f) => (f.id === id ? { ...f, ...field } : f)),
        })),

    removeField: (id) =>
        set((state) => ({
            schema: state.schema.filter((f) => f.id !== id),
        })),

    setGeneratorOptions: (options) =>
        set((state) => ({
            generatorOptions: { ...state.generatorOptions, ...options },
        })),

    generateData: () => {
        const { schema, generatorOptions } = get();
        if (schema.length === 0) return;

        const data = generateMockData(schema, generatorOptions);
        set({ generatedData: data });
    },

    clearData: () => set({ generatedData: [] }),
}));
