// Mock Data Generator Library
import { z } from 'zod';

export type FieldType = 'string' | 'number' | 'boolean' | 'object' | 'bigint' | 'symbol';

export interface FieldSchema {
    id: string;
    name: string;
    type: FieldType;
    required?: boolean;
    default?: any;
    min?: number;
    max?: number;
    length?: number;
    // For arrays - represented as object type with special handling
    isArray?: boolean;
    arrayOf?: FieldType;
    arrayLength?: number;
    // For objects - define properties
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

const randomBigInt = (min = 0, max = 1000000): bigint => {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return BigInt(num);
};

const randomSymbol = (): symbol => {
    return Symbol(randomString(8));
};

const randomObject = (properties?: FieldSchema[]): any => {
    if (properties && properties.length > 0) {
        const obj: any = {};
        properties.forEach((prop) => {
            obj[prop.name] = generateSimpleValue(prop);
        });
        return obj;
    }
    // Default object with common properties
    return {
        id: randomString(8),
        value: randomString(10),
    };
};

// Helper function to generate simple values without recursion issues
const generateSimpleValue = (field: FieldSchema): any => {
    switch (field.type) {
        case 'string':
            return field.length ? randomString(field.length) : randomString();
        case 'number':
            return randomNumber(field.min || 0, field.max || 100);
        case 'boolean':
            return randomBoolean();
        case 'bigint':
            return randomBigInt(field.min, field.max);
        case 'symbol':
            return randomSymbol();
        case 'object':
            return randomObject(field.properties);
        default:
            return randomString();
    }
};

// Realistic generators
const realisticGenerators: Record<string, (field: FieldSchema) => any> = {
    string: (field: FieldSchema) => (field.length ? randomString(field.length) : randomString()),
    number: (field: FieldSchema) => randomNumber(field.min || 0, field.max || 100),
    boolean: randomBoolean,
    bigint: (field: FieldSchema) => randomBigInt(field.min, field.max),
    symbol: randomSymbol,
    object: (field: FieldSchema) => randomObject(field.properties),
};

// Sequential generators
const sequentialGenerators: Record<string, (field: FieldSchema, index: number) => any> = {
    string: (_field: FieldSchema, index: number) => `item_${index}`,
    number: (_field: FieldSchema, index: number) => index,
    boolean: (_field: FieldSchema, index: number) => index % 2 === 0,
    bigint: (_field: FieldSchema, index: number) => BigInt(index),
    symbol: (_field: FieldSchema, index: number) => Symbol(`symbol_${index}`),
    object: (field: FieldSchema, index: number) => {
        if (field.properties && field.properties.length > 0) {
            const obj: any = {};
            field.properties.forEach((prop) => {
                obj[prop.name] = sequentialGenerators[prop.type]?.(prop, index) ?? `value_${index}`;
            });
            return obj;
        }
        return { id: index, value: `item_${index}` };
    },
};

// Generate single value
const generateValue = (field: FieldSchema, options: GeneratorOptions, index: number): any => {
    // Handle arrays (represented as isArray flag)
    if (field.isArray) {
        const arrayLength = field.arrayLength || 3;
        const arrayType = field.arrayOf || 'string';
        return Array.from({ length: arrayLength }, (_, i) => {
            const arrayField: FieldSchema = {
                ...field,
                type: arrayType,
                isArray: false,
            };
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
    // Custom replacer to handle bigint and symbol
    const replacer = (_key: string, value: any) => {
        if (typeof value === 'bigint') {
            return value.toString() + 'n'; // Add 'n' suffix to indicate bigint
        }
        if (typeof value === 'symbol') {
            return value.toString(); // Convert symbol to string
        }
        return value;
    };
    return JSON.stringify(data, replacer, 2);
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
            let typeStr = '';

            // Check isArray first, then handle type
            if (field.isArray && field.arrayOf) {
                // Array type
                if (field.arrayOf === 'object' && field.properties && field.properties.length > 0) {
                    // Object array with properties: { name: string; age: number }[]
                    const props = field.properties
                        .map((prop) => {
                            if (prop.isArray && prop.arrayOf) {
                                return `${prop.name}: ${prop.arrayOf}[]`;
                            }
                            return `${prop.name}: ${prop.type}`;
                        })
                        .join('; ');
                    typeStr = `{ ${props} }[]`;
                } else {
                    // Simple array: string[], number[], etc.
                    typeStr = `${field.arrayOf}[]`;
                }
            } else if (field.type === 'object' && field.properties && field.properties.length > 0) {
                // Non-array object with properties: { name: string; age: number }
                const props = field.properties
                    .map((prop) => {
                        if (prop.isArray && prop.arrayOf) {
                            return `${prop.name}: ${prop.arrayOf}[]`;
                        }
                        return `${prop.name}: ${prop.type}`;
                    })
                    .join('; ');
                typeStr = `{ ${props} }`;
            } else if (field.type === 'bigint') {
                typeStr = 'bigint';
            } else if (field.type === 'symbol') {
                typeStr = 'symbol';
            } else if (field.type === 'object') {
                typeStr = 'Record<string, any>'; // Generic object
            } else {
                // string | number | boolean
                typeStr = field.type;
            }

            schemaTypeMap.set(field.name, typeStr);
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
                if (typeof value === 'bigint') {
                    typeStr = 'bigint';
                } else if (typeof value === 'symbol') {
                    typeStr = 'symbol';
                } else if (Array.isArray(value)) {
                    const arrayType = value.length > 0 ? typeof value[0] : 'any';
                    typeStr = `${arrayType}[]`;
                } else if (typeof value === 'object' && value !== null) {
                    typeStr = 'Record<string, any>';
                } else {
                    typeStr = typeof value;
                }
            }

            return `  ${key}: ${typeStr};`;
        })
        .join('\n');

    // For JSON serialization, convert bigint and symbol to string
    const jsonData = JSON.parse(formatAsJSON(data));

    return `interface ${interfaceName} {\n${interfaceFields}\n}\n\nexport const mockData: ${interfaceName}[] = ${JSON.stringify(
        jsonData,
        null,
        2
    )};`;
};

export const formatAsJavaScript = (data: any[], variableName = 'mockData'): string => {
    return `export const ${variableName} = ${JSON.stringify(data, null, 2)};`;
};

// Create Zod schema from FieldSchema
export const createZodSchema = (schema: FieldSchema[]): z.ZodObject<any> => {
    const shape: Record<string, z.ZodTypeAny> = {};

    schema.forEach((field) => {
        let zodType: z.ZodTypeAny;

        // Handle object types with properties
        if (field.type === 'object' && field.properties && field.properties.length > 0) {
            zodType = createZodSchema(field.properties);
        } else {
            // Handle primitive types
            switch (field.type) {
                case 'string':
                    zodType = z.string();
                    if (field.length) {
                        zodType = (zodType as z.ZodString).length(field.length);
                    }
                    break;
                case 'number':
                    zodType = z.number();
                    if (field.min !== undefined) {
                        zodType = (zodType as z.ZodNumber).min(field.min);
                    }
                    if (field.max !== undefined) {
                        zodType = (zodType as z.ZodNumber).max(field.max);
                    }
                    break;
                case 'boolean':
                    zodType = z.boolean();
                    break;
                case 'bigint':
                    zodType = z.bigint();
                    if (field.min !== undefined) {
                        zodType = (zodType as z.ZodBigInt).min(BigInt(field.min));
                    }
                    if (field.max !== undefined) {
                        zodType = (zodType as z.ZodBigInt).max(BigInt(field.max));
                    }
                    break;
                case 'symbol':
                    zodType = z.symbol();
                    break;
                case 'object':
                    zodType = z.record(z.string(), z.any());
                    break;
                default:
                    zodType = z.any();
            }
        }

        // Handle arrays
        if (field.isArray) {
            zodType = z.array(zodType);
            if (field.arrayLength) {
                zodType = (zodType as z.ZodArray<any>).length(field.arrayLength);
            }
        }

        // Handle optional fields
        if (field.required === false) {
            zodType = zodType.optional();
        }

        shape[field.name] = zodType;
    });

    return z.object(shape);
};

// Validate data against schema
export const validateData = (
    data: any[],
    schema: FieldSchema[]
): { valid: boolean; errors?: string[] } => {
    try {
        const zodSchema = createZodSchema(schema);
        const arraySchema = z.array(zodSchema);
        arraySchema.parse(data);
        return { valid: true };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                valid: false,
                errors: error.issues.map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`),
            };
        }
        return { valid: false, errors: ['Unknown validation error'] };
    }
};

// Generate Zod schema code as string
export const formatAsZodSchema = (schema: FieldSchema[], schemaName = 'mockDataSchema'): string => {
    const generateZodType = (field: FieldSchema, indent = '  '): string => {
        let zodCode = '';

        if (field.type === 'object' && field.properties && field.properties.length > 0) {
            const props = field.properties
                .map(
                    (prop) =>
                        `${indent}  ${prop.name}: ${generateZodType(prop, indent + '  ').trim()}`
                )
                .join(',\n');
            zodCode = `z.object({\n${props}\n${indent}})`;
        } else {
            switch (field.type) {
                case 'string':
                    zodCode = 'z.string()';
                    if (field.length) {
                        zodCode += `.length(${field.length})`;
                    }
                    break;
                case 'number':
                    zodCode = 'z.number()';
                    if (field.min !== undefined) {
                        zodCode += `.min(${field.min})`;
                    }
                    if (field.max !== undefined) {
                        zodCode += `.max(${field.max})`;
                    }
                    break;
                case 'boolean':
                    zodCode = 'z.boolean()';
                    break;
                case 'bigint':
                    zodCode = 'z.bigint()';
                    if (field.min !== undefined) {
                        zodCode += `.min(${field.min}n)`;
                    }
                    if (field.max !== undefined) {
                        zodCode += `.max(${field.max}n)`;
                    }
                    break;
                case 'symbol':
                    zodCode = 'z.symbol()';
                    break;
                case 'object':
                    zodCode = 'z.record(z.string(), z.any())';
                    break;
                default:
                    zodCode = 'z.any()';
            }
        }

        if (field.isArray) {
            zodCode = `z.array(${zodCode})`;
            if (field.arrayLength) {
                zodCode += `.length(${field.arrayLength})`;
            }
        }

        if (field.required === false) {
            zodCode += '.optional()';
        }

        return zodCode;
    };

    const schemaFields = schema
        .map((field) => `  ${field.name}: ${generateZodType(field)}`)
        .join(',\n');

    return `import { z } from 'zod';\n\nexport const ${schemaName} = z.object({\n${schemaFields}\n});\n\nexport type ${
        schemaName.charAt(0).toUpperCase() + schemaName.slice(1)
    }Type = z.infer<typeof ${schemaName}>;`;
};
