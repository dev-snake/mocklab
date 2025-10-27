import { FileText, User, ShoppingCart, Calendar, Database } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useMockStore } from '@/stores/mockStore';
import type { FieldSchema } from '@/core/utils/mock-generator';
import { ScrollArea } from '@/components/ui/scroll-area';

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
            { id: crypto.randomUUID(), name: 'id', type: 'uuid', required: true },
            { id: crypto.randomUUID(), name: 'username', type: 'string', required: true },
            { id: crypto.randomUUID(), name: 'email', type: 'email', required: true },
            { id: crypto.randomUUID(), name: 'fullName', type: 'name', required: true },
            { id: crypto.randomUUID(), name: 'phone', type: 'phone', required: false },
            { id: crypto.randomUUID(), name: 'address', type: 'address', required: false },
            { id: crypto.randomUUID(), name: 'isActive', type: 'boolean', required: true },
            { id: crypto.randomUUID(), name: 'createdAt', type: 'datetime', required: true },
        ],
    },
    {
        name: 'E-commerce Product',
        description: 'Product data for online store',
        icon: <ShoppingCart className="w-5 h-5" />,
        schema: [
            { id: crypto.randomUUID(), name: 'id', type: 'uuid', required: true },
            { id: crypto.randomUUID(), name: 'name', type: 'string', required: true },
            { id: crypto.randomUUID(), name: 'description', type: 'text', required: true },
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
                type: 'enum',
                required: true,
                enum: ['Electronics', 'Clothing', 'Books', 'Home', 'Sports'],
            },
            {
                id: crypto.randomUUID(),
                name: 'tags',
                type: 'array',
                required: false,
                arrayOf: 'string',
                length: 3,
            },
            { id: crypto.randomUUID(), name: 'inStock', type: 'boolean', required: true },
        ],
    },
    {
        name: 'Blog Post',
        description: 'Blog article with metadata',
        icon: <FileText className="w-5 h-5" />,
        schema: [
            { id: crypto.randomUUID(), name: 'id', type: 'uuid', required: true },
            { id: crypto.randomUUID(), name: 'title', type: 'string', required: true },
            { id: crypto.randomUUID(), name: 'slug', type: 'string', required: true },
            { id: crypto.randomUUID(), name: 'content', type: 'text', required: true },
            { id: crypto.randomUUID(), name: 'author', type: 'name', required: true },
            {
                id: crypto.randomUUID(),
                name: 'status',
                type: 'enum',
                required: true,
                enum: ['draft', 'published', 'archived'],
            },
            {
                id: crypto.randomUUID(),
                name: 'tags',
                type: 'array',
                required: false,
                arrayOf: 'string',
                length: 4,
            },
            {
                id: crypto.randomUUID(),
                name: 'views',
                type: 'number',
                required: true,
                min: 0,
                max: 10000,
            },
            { id: crypto.randomUUID(), name: 'publishedAt', type: 'datetime', required: true },
        ],
    },
    {
        name: 'Event/Calendar',
        description: 'Event or calendar entry',
        icon: <Calendar className="w-5 h-5" />,
        schema: [
            { id: crypto.randomUUID(), name: 'id', type: 'uuid', required: true },
            { id: crypto.randomUUID(), name: 'title', type: 'string', required: true },
            { id: crypto.randomUUID(), name: 'description', type: 'text', required: true },
            { id: crypto.randomUUID(), name: 'location', type: 'address', required: false },
            { id: crypto.randomUUID(), name: 'organizer', type: 'name', required: true },
            { id: crypto.randomUUID(), name: 'startDate', type: 'datetime', required: true },
            { id: crypto.randomUUID(), name: 'endDate', type: 'datetime', required: true },
            {
                id: crypto.randomUUID(),
                name: 'type',
                type: 'enum',
                required: true,
                enum: ['conference', 'meeting', 'workshop', 'webinar'],
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
            { id: crypto.randomUUID(), name: 'id', type: 'uuid', required: true },
            { id: crypto.randomUUID(), name: 'name', type: 'company', required: true },
            { id: crypto.randomUUID(), name: 'website', type: 'url', required: true },
            { id: crypto.randomUUID(), name: 'email', type: 'email', required: true },
            { id: crypto.randomUUID(), name: 'phone', type: 'phone', required: true },
            { id: crypto.randomUUID(), name: 'address', type: 'address', required: true },
            {
                id: crypto.randomUUID(),
                name: 'industry',
                type: 'enum',
                required: true,
                enum: ['Technology', 'Finance', 'Healthcare', 'Education', 'Retail'],
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

    return (
        <div className="p-4 pt-3 ">
            <h3 className="text-sm font-semibold mb-3">{t('templates.title')}</h3>
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
