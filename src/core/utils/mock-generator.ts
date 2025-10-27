// Mock Data Generator Library

export type FieldType =
    | 'string'
    | 'number'
    | 'boolean'
    | 'email'
    | 'url'
    | 'date'
    | 'datetime'
    | 'uuid'
    | 'phone'
    | 'name'
    | 'address'
    | 'company'
    | 'text'
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

const randomEmail = (): string => {
    const names = ['john', 'jane', 'alice', 'bob', 'charlie', 'david', 'emma', 'frank'];
    const domains = ['example.com', 'test.com', 'demo.com', 'mail.com'];
    return `${names[Math.floor(Math.random() * names.length)]}${randomNumber(1, 999)}@${
        domains[Math.floor(Math.random() * domains.length)]
    }`;
};

const randomUrl = (): string => {
    const protocols = ['https://'];
    const domains = ['example.com', 'test.com', 'demo.com', 'website.com'];
    const paths = ['', '/page', '/about', '/contact', '/blog'];
    return `${protocols[0]}${domains[Math.floor(Math.random() * domains.length)]}${
        paths[Math.floor(Math.random() * paths.length)]
    }`;
};

const randomDate = (): string => {
    const start = new Date(2020, 0, 1);
    const end = new Date();
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
};

const randomDateTime = (): string => {
    const start = new Date(2020, 0, 1);
    const end = new Date();
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString();
};

const randomUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

const randomPhone = (): string => {
    return `+1 (${randomNumber(200, 999)}) ${randomNumber(200, 999)}-${randomNumber(1000, 9999)}`;
};

const randomName = (): string => {
    const firstNames = [
        'John',
        'Jane',
        'Alice',
        'Bob',
        'Charlie',
        'David',
        'Emma',
        'Frank',
        'Grace',
        'Henry',
        // Vietnamese first names
        'Anh',
        'Bình',
        'Châu',
        'Dũng',
        'Hà',
        'Hải',
        'Hạnh',
        'Hoa',
        'Hùng',
        'Khánh',
        'Lan',
        'Linh',
        'Minh',
        'Nam',
        'Ngọc',
        'Phúc',
        'Quang',
        'Thảo',
        'Thanh',
        'Trang',
        'Tuấn',
        'Việt',
        'Yến',
    ];
    const lastNames = [
        'Smith',
        'Johnson',
        'Williams',
        'Brown',
        'Jones',
        'Garcia',
        'Miller',
        'Davis',
        'Rodriguez',
        'Martinez',
        // Vietnamese last names
        'Nguyễn',
        'Trần',
        'Lê',
        'Phạm',
        'Hoàng',
        'Huỳnh',
        'Phan',
        'Vũ',
        'Đặng',
        'Bùi',
        'Đỗ',
        'Hồ',
        'Ngô',
        'Dương',
        'Đinh',
        'Chu',
        'Lý',
    ];
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${
        lastNames[Math.floor(Math.random() * lastNames.length)]
    }`;
};

const randomAddress = (): string => {
    const streets = [
        'Main St',
        'Oak Ave',
        'Maple Dr',
        'Cedar Ln',
        'Pine Rd',
        'Elm St',
        // Vietnamese street names
        'Nguyễn Trãi',
        'Lê Lợi',
        'Trần Hưng Đạo',
        'Phan Đình Phùng',
        'Hai Bà Trưng',
        'Điện Biên Phủ',
        'Hoàng Văn Thụ',
        'Bạch Đằng',
        'Tôn Đức Thắng',
        'Quang Trung',
    ];
    const cities = [
        'New York',
        'Los Angeles',
        'Chicago',
        'Houston',
        'Phoenix',
        'Philadelphia',
        // Vietnamese cities
        'Hà Nội',
        'Hồ Chí Minh',
        'Đà Nẵng',
        'Hải Phòng',
        'Cần Thơ',
        'Huế',
        'Nha Trang',
        'Vũng Tàu',
        'Biên Hòa',
        'Buôn Ma Thuột',
    ];
    return `${randomNumber(100, 9999)} ${streets[Math.floor(Math.random() * streets.length)]}, ${
        cities[Math.floor(Math.random() * cities.length)]
    }`;
};

const randomCompany = (): string => {
    const prefixes = ['Tech', 'Global', 'Digital', 'Smart', 'Pro', 'Next'];
    const suffixes = ['Solutions', 'Systems', 'Corp', 'Inc', 'Industries', 'Group'];
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${
        suffixes[Math.floor(Math.random() * suffixes.length)]
    }`;
};

const randomText = (sentences = 3): string => {
    const words = [
        'lorem',
        'ipsum',
        'dolor',
        'sit',
        'amet',
        'consectetur',
        'adipiscing',
        'elit',
        'sed',
        'do',
        'eiusmod',
        'tempor',
        'incididunt',
        // Vietnamese words
        'xin',
        'chào',
        'bạn',
        'cảm',
        'ơn',
        'tôi',
        'bạn',
        'đẹp',
        'học',
        'việt',
        'nam',
        'ngày',
        'tháng',
        'năm',
        'trường',
        'lớp',
        'giáo',
        'viên',
        'sinh',
        'viên',
        'hạnh',
        'phúc',
        'thành',
        'công',
        'gia',
        'đình',
        'bạn',
        'bè',
        'yêu',
        'thương',
        'mơ',
        'ước',
        'cuộc',
        'sống',
        'vui',
        'khỏe',
        'tốt',
        'đẹp',
        'hòa',
        'bình',
        'tự',
        'do',
        'phát',
        'triển',
        'tiến',
        'bộ',
        'học',
        'tập',
        'làm',
        'việc',
        'thành',
        'phố',
        'quê',
        'hương',
        'đất',
        'nước',
        'bầu',
        'trời',
        'mặt',
        'trời',
        'biển',
        'núi',
        'sông',
        'hoa',
        'lá',
        'cây',
        'rừng',
        'đồng',
        'ruộng',
        'người',
        'dân',
        'thủ',
        'đô',
        'hà',
        'nội',
        'sài',
        'gòn',
        'đà',
        'nẵng',
        'huế',
        'hải',
        'phòng',
        'cần',
        'thơ',
    ];
    let text = '';
    for (let i = 0; i < sentences; i++) {
        const sentenceLength = randomNumber(5, 15);
        const sentence = [];
        for (let j = 0; j < sentenceLength; j++) {
            sentence.push(words[Math.floor(Math.random() * words.length)]);
        }
        text +=
            sentence[0].charAt(0).toUpperCase() +
            sentence[0].slice(1) +
            ' ' +
            sentence.slice(1).join(' ') +
            '. ';
    }
    return text.trim();
};

// Realistic generators
const realisticGenerators: Record<string, (field: FieldSchema) => any> = {
    string: (field: FieldSchema) => (field.length ? randomString(field.length) : randomString()),
    number: (field: FieldSchema) => randomNumber(field.min || 0, field.max || 100),
    boolean: randomBoolean,
    email: randomEmail,
    url: randomUrl,
    date: randomDate,
    datetime: randomDateTime,
    uuid: randomUUID,
    phone: randomPhone,
    name: randomName,
    address: randomAddress,
    company: randomCompany,
    text: () => randomText(),
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
    email: (_field: FieldSchema, index: number) => `user${index}@example.com`,
    url: (_field: FieldSchema, index: number) => `https://example.com/page${index}`,
    date: (_field: FieldSchema, index: number) => {
        const date = new Date(2024, 0, 1);
        date.setDate(date.getDate() + index);
        return date.toISOString().split('T')[0];
    },
    datetime: (_field: FieldSchema, index: number) => {
        const date = new Date(2024, 0, 1);
        date.setHours(date.getHours() + index);
        return date.toISOString();
    },
    uuid: (_field: FieldSchema, index: number) =>
        `00000000-0000-4000-8000-${String(index).padStart(12, '0')}`,
    phone: (_field: FieldSchema, index: number) => `+1 (555) 000-${String(index).padStart(4, '0')}`,
    name: (_field: FieldSchema, index: number) => `User ${index}`,
    address: (_field: FieldSchema, index: number) => `${index} Main St, City`,
    company: (_field: FieldSchema, index: number) => `Company ${index}`,
    text: (_field: FieldSchema, index: number) => `This is text content for item ${index}.`,
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
            } else if (field.type === 'date' || field.type === 'datetime') {
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
