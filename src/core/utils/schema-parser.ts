import type { FieldSchema, FieldType } from './mock-generator';

/**
 * Parse JSON data and extract schema structure
 */
export const parseJSONToSchema = (jsonString: string): FieldSchema[] => {
    try {
        const data = JSON.parse(jsonString);

        const sample = Array.isArray(data) ? data[0] : data;

        if (!sample || typeof sample !== 'object') {
            throw new Error('Invalid JSON structure');
        }

        return extractSchemaFromObject(sample);
    } catch (error) {
        throw new Error(
            `Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
    }
};

/**
 * Extract schema from a JavaScript object
 */
const extractSchemaFromObject = (obj: any): FieldSchema[] => {
    const schema: FieldSchema[] = [];

    for (const [key, value] of Object.entries(obj)) {
        const field = extractFieldSchema(key, value);
        if (field) {
            schema.push(field);
        }
    }

    return schema;
};

/**
 * Determine field type and create FieldSchema
 */
const extractFieldSchema = (name: string, value: any): FieldSchema | null => {
    const id = crypto.randomUUID();

    if (value === null || value === undefined) {
        return {
            id,
            name,
            type: 'string',
            required: false,
        };
    }

    if (Array.isArray(value)) {
        if (value.length === 0) {
            return {
                id,
                name,
                type: 'string',
                required: true,
                isArray: true,
                arrayOf: 'string',
                arrayLength: 3,
            };
        }

        const firstItem = value[0];
        const itemType = inferType(firstItem);

        if (itemType === 'object' && typeof firstItem === 'object') {
            const properties = extractSchemaFromObject(firstItem);
            return {
                id,
                name,
                type: 'object',
                required: true,
                isArray: true,
                arrayOf: 'object',
                arrayLength: value.length,
                properties,
            };
        }

        return {
            id,
            name,
            type: itemType,
            required: true,
            isArray: true,
            arrayOf: itemType,
            arrayLength: value.length,
        };
    }

    if (typeof value === 'object') {
        const properties = extractSchemaFromObject(value);
        return {
            id,
            name,
            type: 'object',
            required: true,
            properties,
        };
    }

    const type = inferType(value);
    const field: FieldSchema = {
        id,
        name,
        type,
        required: true,
    };

    if (type === 'number' && typeof value === 'number') {
        field.min = 0;
        field.max = Math.max(100, Math.ceil(value * 2));
    }

    if (type === 'string' && typeof value === 'string') {
        if (isDateString(value)) {
            field.type = 'date';
        }
    }

    return field;
};

/**
 * Infer field type from value
 */
const inferType = (value: any): FieldType => {
    if (value === null || value === undefined) {
        return 'string';
    }

    const jsType = typeof value;

    switch (jsType) {
        case 'string':
            if (isDateString(value)) {
                return 'date';
            }
            return 'string';
        case 'number':
            return 'number';
        case 'boolean':
            return 'boolean';
        case 'object':
            if (Array.isArray(value)) {
                return 'string';
            }
            return 'object';
        case 'symbol':
            return 'symbol';
        default:
            return 'string';
    }
};

/**
 * Check if string is a date string
 */
const isDateString = (value: string): boolean => {
    const isoDatePattern = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/;
    if (isoDatePattern.test(value)) {
        const date = new Date(value);
        return !isNaN(date.getTime());
    }
    return false;
};

/**
 * Validate JSON string
 */
export const isValidJSON = (jsonString: string): boolean => {
    try {
        JSON.parse(jsonString);
        return true;
    } catch {
        return false;
    }
};

/**
 * Format JSON string with proper indentation
 */
export const formatJSON = (jsonString: string): string => {
    try {
        const parsed = JSON.parse(jsonString);
        return JSON.stringify(parsed, null, 2);
    } catch {
        return jsonString;
    }
};
