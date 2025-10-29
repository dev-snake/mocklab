import { FileText, User, ShoppingCart, Calendar, Database, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useMockStore } from '@/stores/mockStore';
import type { FieldSchema } from '@/core/utils/mock-generator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { parseJSONToSchema, isValidJSON } from '@/core/utils/schema-parser';
import { toast } from 'sonner';

interface Template {
    name: string;
    description: string;
    icon: React.ReactNode;
    schema: FieldSchema[];
}

const templates: Template[] = [
    {
        name: 'User Profile',
        description: 'Basic user profile with common fields',
        icon: <User className="w-5 h-5" />,
        schema: [
            { id: crypto.randomUUID(), name: 'id', type: 'string', required: true },
            { id: crypto.randomUUID(), name: 'username', type: 'string', required: true },
            { id: crypto.randomUUID(), name: 'email', type: 'string', required: true },
            { id: crypto.randomUUID(), name: 'fullName', type: 'string', required: true },
            { id: crypto.randomUUID(), name: 'phone', type: 'string', required: false },
            { id: crypto.randomUUID(), name: 'address', type: 'string', required: false },
            { id: crypto.randomUUID(), name: 'isActive', type: 'boolean', required: true },
            { id: crypto.randomUUID(), name: 'createdAt', type: 'string', required: true },
        ],
    },
    {
        name: 'E-commerce Product',
        description: 'Product data for online store',
        icon: <ShoppingCart className="w-5 h-5" />,
        schema: [
            { id: crypto.randomUUID(), name: 'id', type: 'string', required: true },
            { id: crypto.randomUUID(), name: 'name', type: 'string', required: true },
            { id: crypto.randomUUID(), name: 'description', type: 'string', required: true },
            {
                id: crypto.randomUUID(),
                name: 'price',
                type: 'number',
                required: true,
                min: 10,
                max: 1000,
            },
            {
                id: crypto.randomUUID(),
                name: 'stock',
                type: 'number',
                required: true,
                min: 0,
                max: 500,
            },
            {
                id: crypto.randomUUID(),
                name: 'category',
                type: 'string',
                required: true,
            },
            {
                id: crypto.randomUUID(),
                name: 'tags',
                type: 'string',
                required: false,
                isArray: true,
                arrayOf: 'string',
                arrayLength: 3,
            },
            { id: crypto.randomUUID(), name: 'inStock', type: 'boolean', required: true },
        ],
    },
    {
        name: 'Blog Post',
        description: 'Blog article with metadata',
        icon: <FileText className="w-5 h-5" />,
        schema: [
            { id: crypto.randomUUID(), name: 'id', type: 'string', required: true },
            { id: crypto.randomUUID(), name: 'title', type: 'string', required: true },
            { id: crypto.randomUUID(), name: 'slug', type: 'string', required: true },
            { id: crypto.randomUUID(), name: 'content', type: 'string', required: true },
            { id: crypto.randomUUID(), name: 'author', type: 'string', required: true },
            {
                id: crypto.randomUUID(),
                name: 'status',
                type: 'string',
                required: true,
            },
            {
                id: crypto.randomUUID(),
                name: 'tags',
                type: 'string',
                required: false,
                isArray: true,
                arrayOf: 'string',
                arrayLength: 4,
            },
            {
                id: crypto.randomUUID(),
                name: 'views',
                type: 'number',
                required: true,
                min: 0,
                max: 10000,
            },
            { id: crypto.randomUUID(), name: 'publishedAt', type: 'string', required: true },
        ],
    },
    {
        name: 'Event/Calendar',
        description: 'Event or calendar entry',
        icon: <Calendar className="w-5 h-5" />,
        schema: [
            { id: crypto.randomUUID(), name: 'id', type: 'string', required: true },
            { id: crypto.randomUUID(), name: 'title', type: 'string', required: true },
            { id: crypto.randomUUID(), name: 'description', type: 'string', required: true },
            { id: crypto.randomUUID(), name: 'location', type: 'string', required: false },
            { id: crypto.randomUUID(), name: 'organizer', type: 'string', required: true },
            { id: crypto.randomUUID(), name: 'startDate', type: 'string', required: true },
            { id: crypto.randomUUID(), name: 'endDate', type: 'string', required: true },
            {
                id: crypto.randomUUID(),
                name: 'type',
                type: 'string',
                required: true,
            },
            {
                id: crypto.randomUUID(),
                name: 'maxAttendees',
                type: 'number',
                required: false,
                min: 10,
                max: 500,
            },
        ],
    },
    {
        name: 'Company/Organization',
        description: 'Business or organization profile',
        icon: <Database className="w-5 h-5" />,
        schema: [
            { id: crypto.randomUUID(), name: 'id', type: 'string', required: true },
            { id: crypto.randomUUID(), name: 'name', type: 'string', required: true },
            { id: crypto.randomUUID(), name: 'website', type: 'string', required: true },
            { id: crypto.randomUUID(), name: 'email', type: 'string', required: true },
            { id: crypto.randomUUID(), name: 'phone', type: 'string', required: true },
            { id: crypto.randomUUID(), name: 'address', type: 'string', required: true },
            {
                id: crypto.randomUUID(),
                name: 'industry',
                type: 'string',
                required: true,
            },
            {
                id: crypto.randomUUID(),
                name: 'employees',
                type: 'number',
                required: true,
                min: 1,
                max: 10000,
            },
            {
                id: crypto.randomUUID(),
                name: 'foundedYear',
                type: 'number',
                required: true,
                min: 1900,
                max: 2025,
            },
        ],
    },
];

export const SchemaTemplates = () => {
    const { t } = useTranslation();
    const { setSchema } = useMockStore();
    const [jsonInput, setJsonInput] = useState('');
    const [showJsonInput, setShowJsonInput] = useState(false);

    const templatesWithTranslation: Template[] = [
        {
            name: t('templates.userProfile'),
            description: t('templates.userProfileDesc'),
            icon: <User className="w-5 h-5" />,
            schema: templates[0].schema,
        },
        {
            name: t('templates.ecommerce'),
            description: t('templates.ecommerceDesc'),
            icon: <ShoppingCart className="w-5 h-5" />,
            schema: templates[1].schema,
        },
        {
            name: t('templates.blogPost'),
            description: t('templates.blogPostDesc'),
            icon: <FileText className="w-5 h-5" />,
            schema: templates[2].schema,
        },
        {
            name: t('templates.event'),
            description: t('templates.eventDesc'),
            icon: <Calendar className="w-5 h-5" />,
            schema: templates[3].schema,
        },
        {
            name: t('templates.company'),
            description: t('templates.companyDesc'),
            icon: <Database className="w-5 h-5" />,
            schema: templates[4].schema,
        },
    ];

    const handleUseTemplate = (template: Template) => {
        setSchema(template.schema);
    };

    const handleParseJSON = () => {
        if (!jsonInput.trim()) {
            toast.error(t('messages.emptyJSON'));
            return;
        }

        if (!isValidJSON(jsonInput)) {
            toast.error(t('messages.invalidJSON'));
            return;
        }

        try {
            const schema = parseJSONToSchema(jsonInput);
            setSchema(schema);
            toast.success(t('messages.jsonParsedSuccess'));
            setJsonInput('');
            setShowJsonInput(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : t('messages.jsonParseError'));
        }
    };

    return (
        <div className="p-4 pt-3 ">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">{t('templates.title')}</h3>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowJsonInput(!showJsonInput)}
                    className="h-7 text-xs rounded-none gap-1.5"
                >
                    <Upload className="w-3.5 h-3.5" />
                    {t('templates.pasteJSON')}
                </Button>
            </div>

            {showJsonInput && (
                <div className="mb-3 p-3 border rounded-none bg-accent/20 space-y-2">
                    <p className="text-xs text-muted-foreground">{t('templates.pasteJSONDesc')}</p>
                    <Textarea
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        placeholder={t('templates.pasteJSONPlaceholder')}
                        className="h-60 font-mono text-xs rounded-none overflow-y-scroll"
                    />
                    <div className="flex gap-2">
                        <Button
                            onClick={handleParseJSON}
                            size="sm"
                            className="h-7 text-xs rounded-none flex-1"
                        >
                            {t('templates.generateSchema')}
                        </Button>
                        <Button
                            onClick={() => {
                                setJsonInput('');
                                setShowJsonInput(false);
                            }}
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs rounded-none"
                        >
                            {t('common.cancel')}
                        </Button>
                    </div>
                </div>
            )}

            <ScrollArea className="h-[220px]">
                <div className="space-y-2 pr-3">
                    {templatesWithTranslation.map((template) => (
                        <div
                            key={template.name}
                            className="p-3 border rounded-none hover:bg-accent/50 transition-colors"
                        >
                            <div className="flex items-start gap-3">
                                <div className="shrink-0 w-10 h-10 rounded-none bg-primary/5 flex items-center justify-center text-primary">
                                    {template.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-sm mb-1.5">{template.name}</h4>
                                    <p className="text-xs text-muted-foreground mb-2.5 leading-relaxed">
                                        {template.description}
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleUseTemplate(template)}
                                        className="h-7 text-xs rounded-none hover:cursor-pointer"
                                    >
                                        Use Template
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};
