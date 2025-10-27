// Mock Data Generator Library

export type FieldType =
    | 'string'
    | 'number'
    | 'boolean'
    | 'date'
    | 'uuid'
    | 'enum'
    | 'array'
    | 'object';

export interface FieldSchema {
    id: string;
    name: string;
    type: FieldType;
    required?: boolean;
    default?: any;
    min?: number;
    max?: number;
    pattern?: string;
    enum?: string[];
    length?: number;
    arrayOf?: FieldType;
    properties?: FieldSchema[];
}

export type GeneratorType = 'random' | 'realistic' | 'sequential' | 'template' | 'custom';

export interface GeneratorOptions {
    type: GeneratorType;
    count: number;
    seed?: number;
    template?: string;
    customGenerator?: (field: FieldSchema, index: number) => any;
}

// Random generators
const randomString = (length = 10): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

const randomNumber = (min = 0, max = 100): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomBoolean = (): boolean => Math.random() > 0.5;

const randomDate = (): string => {
    const start = new Date(2020, 0, 1);
    const end = new Date();
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
};

const randomUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

// Realistic generators
const realisticGenerators: Record<string, (field: FieldSchema) => any> = {
    string: (field: FieldSchema) => (field.length ? randomString(field.length) : randomString()),
    number: (field: FieldSchema) => randomNumber(field.min || 0, field.max || 100),
    boolean: randomBoolean,
    date: randomDate,
    uuid: randomUUID,
    enum: (field: FieldSchema) =>
        field.enum && field.enum.length > 0
            ? field.enum[Math.floor(Math.random() * field.enum.length)]
            : 'option',
};

// Sequential generators
const sequentialGenerators: Record<string, (field: FieldSchema, index: number) => any> = {
    string: (_field: FieldSchema, index: number) => `item_${index}`,
    number: (_field: FieldSchema, index: number) => index,
    boolean: (_field: FieldSchema, index: number) => index % 2 === 0,
    date: (_field: FieldSchema, index: number) => {
        const date = new Date(2024, 0, 1);
        date.setDate(date.getDate() + index);
        return date.toISOString().split('T')[0];
    },
    uuid: (_field: FieldSchema, index: number) =>
        `00000000-0000-4000-8000-${String(index).padStart(12, '0')}`,
    enum: (field: FieldSchema, index: number) =>
        field.enum && field.enum.length > 0 ? field.enum[index % field.enum.length] : 'option',
};

// Generate single value
const generateValue = (field: FieldSchema, options: GeneratorOptions, index: number): any => {
    if (field.type === 'array') {
        const arrayLength = field.length || 3;
        const arrayType = field.arrayOf || 'string';
        return Array.from({ length: arrayLength }, (_, i) => {
            const arrayField = { ...field, type: arrayType };
            return generateValue(arrayField, options, i);
        });
    }

    if (field.type === 'object' && field.properties) {
        const obj: any = {};
        field.properties.forEach((prop) => {
            obj[prop.name] = generateValue(prop, options, index);
        });
        return obj;
    }

    if (options.customGenerator) {
        return options.customGenerator(field, index);
    }

    switch (options.type) {
        case 'sequential':
            return sequentialGenerators[field.type]?.(field, index) ?? `value_${index}`;
        case 'realistic':
            return realisticGenerators[field.type]?.(field) ?? randomString();
        case 'random':
        default:
            return realisticGenerators[field.type]?.(field) ?? randomString();
    }
};

// Main generator function
export const generateMockData = (schema: FieldSchema[], options: GeneratorOptions): any[] => {
    const result: any[] = [];

    for (let i = 0; i < options.count; i++) {
        const item: any = {};

        schema.forEach((field) => {
            if (field.required !== false) {
                item[field.name] = generateValue(field, options, i);
            }
        });

        result.push(item);
    }

    return result;
};

// Export formatters
export const formatAsJSON = (data: any[]): string => {
    return JSON.stringify(data, null, 2);
};

export const formatAsTypeScript = (
    data: any[],
    schema?: FieldSchema[],
    interfaceName = 'MockData'
): string => {
    const sample = data[0] || {};

    // Build a map of field names to their types from schema
    const schemaTypeMap = new Map<string, string>();
    if (schema) {
        schema.forEach((field) => {
            if (field.type === 'enum' && field.enum) {
                // For enum, create union type
                schemaTypeMap.set(field.name, field.enum.map((v) => `'${v}'`).join(' | '));
            } else if (field.type === 'array' && field.arrayOf) {
                schemaTypeMap.set(field.name, `${field.arrayOf}[]`);
            } else if (field.type === 'number') {
                schemaTypeMap.set(field.name, 'number');
            } else if (field.type === 'boolean') {
                schemaTypeMap.set(field.name, 'boolean');
            } else if (field.type === 'date') {
                schemaTypeMap.set(field.name, 'string');
            } else {
                schemaTypeMap.set(field.name, 'string');
            }
        });
    }

    const interfaceFields = Object.entries(sample)
        .map(([key, value]) => {
            let typeStr: string;

            // Check if we have schema type info
            if (schemaTypeMap.has(key)) {
                typeStr = schemaTypeMap.get(key)!;
            } else {
                // Fallback to runtime type detection
                typeStr = typeof value;
                if (Array.isArray(value)) {
                    const arrayType = value.length > 0 ? typeof value[0] : 'any';
                    typeStr = `${arrayType}[]`;
                }
            }

            return `  ${key}: ${typeStr};`;
        })
        .join('\n');

    return `interface ${interfaceName} {\n${interfaceFields}\n}\n\nexport const mockData: ${interfaceName}[] = ${JSON.stringify(
        data,
        null,
        2
    )};`;
};

export const formatAsJavaScript = (data: any[], variableName = 'mockData'): string => {
    return `export const ${variableName} = ${JSON.stringify(data, null, 2)};`;
};
