import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { FieldSchema, FieldType } from '@/core/utils/mock-generator';
import { useMockStore } from '@/stores/mockStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SchemaTemplates } from './SchemaTemplates';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

const fieldTypes: FieldType[] = [
    'string',
    'number',
    'boolean',
    'email',
    'url',
    'date',
    'datetime',
    'uuid',
    'phone',
    'name',
    'address',
    'company',
    'text',
    'enum',
    'array',
];

export const SchemaBuilder = () => {
    const { t } = useTranslation();
    const { schema, addField, removeField } = useMockStore();
    const [editingField, setEditingField] = useState<Partial<FieldSchema>>({
        id: crypto.randomUUID(),
        name: '',
        type: 'string',
        required: true,
    });

    const handleAddField = () => {
        if (!editingField.name) return;

        addField(editingField as FieldSchema);
        setEditingField({
            id: crypto.randomUUID(),
            name: '',
            type: 'string',
            required: true,
        });
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b">
                <h2 className="text-lg font-semibold mb-4">{t('schemaBuilder.title')}</h2>

                {/* Add Field Form */}
                <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="field-name">{t('schemaBuilder.fieldName')}</Label>
                            <Input
                                id="field-name"
                                placeholder={t('schemaBuilder.fieldNamePlaceholder')}
                                value={editingField.name}
                                onChange={(e) =>
                                    setEditingField({ ...editingField, name: e.target.value })
                                }
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleAddField();
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="field-type">{t('schemaBuilder.fieldType')}</Label>
                            <Select
                                value={editingField.type}
                                onValueChange={(value) =>
                                    setEditingField({ ...editingField, type: value as FieldType })
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={t('schemaBuilder.fieldType')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>{t('schemaBuilder.fieldType')}</SelectLabel>
                                        {fieldTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {t(`fieldTypes.${type}`)}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {editingField.type === 'number' && (
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="field-min">{t('schemaBuilder.min')}</Label>
                                <Input
                                    id="field-min"
                                    type="number"
                                    placeholder="0"
                                    value={editingField.min ?? ''}
                                    onChange={(e) =>
                                        setEditingField({
                                            ...editingField,
                                            min: parseInt(e.target.value) || 0,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="field-max">{t('schemaBuilder.max')}</Label>
                                <Input
                                    id="field-max"
                                    type="number"
                                    placeholder="100"
                                    value={editingField.max ?? ''}
                                    onChange={(e) =>
                                        setEditingField({
                                            ...editingField,
                                            max: parseInt(e.target.value) || 100,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    )}

                    {editingField.type === 'enum' && (
                        <div className="space-y-2">
                            <Label htmlFor="field-enum">{t('schemaBuilder.enumValues')}</Label>
                            <Input
                                id="field-enum"
                                placeholder={t('schemaBuilder.enumPlaceholder')}
                                value={editingField.enum?.join(',') ?? ''}
                                onChange={(e) =>
                                    setEditingField({
                                        ...editingField,
                                        enum: e.target.value
                                            .split(',')
                                            .map((v) => v.trim())
                                            .filter(Boolean),
                                    })
                                }
                            />
                        </div>
                    )}

                    {editingField.type === 'array' && (
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="array-type">
                                    {t('schemaBuilder.arrayItemType')}
                                </Label>
                                <Select
                                    value={editingField.arrayOf || 'string'}
                                    onValueChange={(value) =>
                                        setEditingField({
                                            ...editingField,
                                            arrayOf: value as FieldType,
                                        })
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue
                                            placeholder={t('schemaBuilder.arrayItemType')}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>
                                                {t('schemaBuilder.arrayItemType')}
                                            </SelectLabel>
                                            {fieldTypes
                                                .filter((t) => t !== 'array' && t !== 'object')
                                                .map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {t(`fieldTypes.${type}`)}
                                                    </SelectItem>
                                                ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="array-length">
                                    {t('schemaBuilder.arrayLength')}
                                </Label>
                                <Input
                                    id="array-length"
                                    type="number"
                                    placeholder="3"
                                    value={editingField.length ?? ''}
                                    onChange={(e) =>
                                        setEditingField({
                                            ...editingField,
                                            length: parseInt(e.target.value) || 3,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="field-required"
                            checked={editingField.required}
                            onCheckedChange={(checked) =>
                                setEditingField({ ...editingField, required: checked as boolean })
                            }
                        />
                        <Label htmlFor="field-required">{t('common.required')}</Label>
                    </div>

                    <Button onClick={handleAddField} className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        {t('schemaBuilder.addField')}
                    </Button>
                </div>
            </div>

            {/* Resizable Field List and Templates */}
            <ResizablePanelGroup direction="vertical" className="flex-1 min-h-0">
                {/* Field List */}
                <ResizablePanel defaultSize={60} minSize={30}>
                    <ScrollArea className="h-full">
                        <div className="p-4 space-y-2">
                            {schema.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    {t('schemaBuilder.noFields')}
                                </div>
                            ) : (
                                schema.map((field) => (
                                    <div
                                        key={field.id}
                                        className="flex items-center gap-2 p-3 bg-card border rounded-lg hover:bg-accent/50 transition-colors"
                                    >
                                        <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium truncate">
                                                    {field.name}
                                                </span>
                                                <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded">
                                                    {field.type}
                                                </span>
                                                {field.required && (
                                                    <span className="text-xs text-red-500">*</span>
                                                )}
                                            </div>
                                            {field.type === 'enum' && field.enum && (
                                                <div className="text-xs text-muted-foreground truncate">
                                                    {field.enum.join(', ')}
                                                </div>
                                            )}
                                            {field.type === 'array' && field.arrayOf && (
                                                <div className="text-xs text-muted-foreground">
                                                    {field.arrayOf}[] (length: {field.length || 3})
                                                </div>
                                            )}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeField(field.id)}
                                        >
                                            <Trash2 className="w-4 h-4 text-destructive" />
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </ResizablePanel>

                <ResizableHandle
                    withHandle
                    className="hover:bg-primary/20 active:bg-primary/30 transition-colors"
                />

                {/* Templates */}
                <ResizablePanel defaultSize={40} minSize={20} maxSize={60}>
                    <SchemaTemplates />
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};
