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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

const fieldTypes: FieldType[] = ['string', 'number', 'boolean', 'object', 'bigint', 'symbol'];

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

        // Check for duplicate field names
        const isDuplicate = schema.some(
            (field) => field.name.toLowerCase() === editingField.name!.toLowerCase()
        );

        if (isDuplicate) {
            toast(t('messages.duplicateField') || 'Field name already exists!', {
                position: 'top-center',
                icon: <Trash2 className="w-5 h-5 text-destructive" />,
                className: 'rounded-none border-none',
            });
            return;
        }

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
                <div className="space-y-3 py-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="field-name">{t('schemaBuilder.fieldName')}</Label>
                            <Input
                                id="field-name"
                                className="rounded-none"
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
                                onValueChange={(value) => {
                                    setEditingField({ ...editingField, type: value as FieldType });
                                }}
                            >
                                <SelectTrigger className="w-full rounded-none">
                                    <SelectValue placeholder={t('schemaBuilder.fieldType')} />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectGroup>
                                        <SelectLabel>{t('schemaBuilder.fieldType')}</SelectLabel>
                                        {fieldTypes.map((type) => (
                                            <SelectItem
                                                key={type}
                                                value={type}
                                                className="rounded-none"
                                            >
                                                {type}
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
                                    className="rounded-none"
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
                                    className="rounded-none"
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

                    {editingField.type === 'bigint' && (
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="bigint-min">{t('schemaBuilder.min')}</Label>
                                <Input
                                    id="bigint-min"
                                    type="number"
                                    className="rounded-none"
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
                                <Label htmlFor="bigint-max">{t('schemaBuilder.max')}</Label>
                                <Input
                                    id="bigint-max"
                                    type="number"
                                    className="rounded-none"
                                    placeholder="1000000"
                                    value={editingField.max ?? ''}
                                    onChange={(e) =>
                                        setEditingField({
                                            ...editingField,
                                            max: parseInt(e.target.value) || 1000000,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    )}

                    {editingField.type === 'object' && (
                        <div className="space-y-2">
                            <Label htmlFor="object-props">
                                {t('schemaBuilder.objectProperties')}
                            </Label>
                            <Input
                                id="object-props"
                                className="rounded-none"
                                placeholder="username:string, age:number"
                                onChange={(e) => {
                                    const input = e.target.value;
                                    if (input.trim()) {
                                        try {
                                            // Parse format: "key:type, key:type"
                                            const props = input
                                                .split(',')
                                                .map((prop) => prop.trim())
                                                .filter(Boolean)
                                                .map((prop) => {
                                                    const [name, type] = prop
                                                        .split(':')
                                                        .map((s) => s.trim());
                                                    return {
                                                        id: crypto.randomUUID(),
                                                        name,
                                                        type: type as FieldType,
                                                        required: true,
                                                    };
                                                });
                                            setEditingField({
                                                ...editingField,
                                                properties: props,
                                            });
                                        } catch (err) {
                                            // Invalid format, ignore
                                        }
                                    } else {
                                        setEditingField({
                                            ...editingField,
                                            properties: undefined,
                                        });
                                    }
                                }}
                            />
                            <p className="text-xs text-muted-foreground">
                                {t('schemaBuilder.objectPropertiesHint')}
                            </p>
                        </div>
                    )}

                    {/* Array configuration */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="field-is-array"
                            className="rounded-none hover:cursor-pointer"
                            checked={editingField.isArray || false}
                            onCheckedChange={(checked) => {
                                if (checked) {
                                    setEditingField({
                                        ...editingField,
                                        isArray: true,
                                        arrayOf: editingField.type,
                                        arrayLength: editingField.arrayLength || 3,
                                        // Keep properties for object type arrays
                                    });
                                } else {
                                    setEditingField({
                                        ...editingField,
                                        isArray: false,
                                        arrayOf: undefined,
                                        arrayLength: undefined,
                                    });
                                }
                            }}
                        />
                        <Label htmlFor="field-is-array">{t('schemaBuilder.isArray')}</Label>
                    </div>

                    {editingField.isArray && (
                        <div className="space-y-2">
                            <Label htmlFor="array-length">{t('schemaBuilder.arrayLength')}</Label>
                            <Input
                                id="array-length"
                                type="number"
                                className="rounded-none"
                                placeholder="3"
                                value={editingField.arrayLength ?? ''}
                                onChange={(e) =>
                                    setEditingField({
                                        ...editingField,
                                        arrayLength: parseInt(e.target.value) || 3,
                                    })
                                }
                            />
                        </div>
                    )}

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="field-required"
                            className="rounded-none hover:cursor-pointer"
                            checked={editingField.required}
                            onCheckedChange={(checked) =>
                                setEditingField({ ...editingField, required: checked as boolean })
                            }
                        />
                        <Label htmlFor="field-required">{t('common.required')}</Label>
                    </div>

                    <Button
                        onClick={handleAddField}
                        className="w-full rounded-none hover:cursor-pointer"
                    >
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
                        <div className="p-4 space-y-2 ">
                            {schema.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    {t('schemaBuilder.noFields')}
                                </div>
                            ) : (
                                schema.map((field) => (
                                    <div
                                        key={field.id}
                                        className="flex items-center gap-2 p-3 bg-card border rounded-none hover:bg-accent/50 transition-colors"
                                    >
                                        <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium truncate">
                                                    {field.name}
                                                </span>
                                                <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded">
                                                    {field.isArray && field.arrayOf
                                                        ? field.arrayOf === 'object' &&
                                                          field.properties &&
                                                          field.properties.length > 0
                                                            ? `{ ${field.properties
                                                                  .map(
                                                                      (p) => `${p.name}: ${p.type}`
                                                                  )
                                                                  .join(', ')} }[]`
                                                            : `${field.arrayOf}[]`
                                                        : field.type === 'object' &&
                                                          field.properties &&
                                                          field.properties.length > 0
                                                        ? `{ ${field.properties
                                                              .map((p) => `${p.name}: ${p.type}`)
                                                              .join(', ')} }`
                                                        : field.type}
                                                </span>
                                                {field.required && (
                                                    <span className="text-xs text-red-500">*</span>
                                                )}
                                            </div>
                                            {field.isArray && field.arrayOf && (
                                                <div className="text-xs text-muted-foreground">
                                                    Array length: {field.arrayLength || 3}
                                                </div>
                                            )}
                                            {field.type === 'number' &&
                                                (field.min !== undefined ||
                                                    field.max !== undefined) && (
                                                    <div className="text-xs text-muted-foreground">
                                                        Range: {field.min ?? 0} - {field.max ?? 100}
                                                    </div>
                                                )}
                                        </div>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="hover:cursor-pointer"
                                                    onClick={() => removeField(field.id)}
                                                >
                                                    <Trash2 className="w-4 h-4 text-destructive" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent className="rounded-none">
                                                Delete
                                            </TooltipContent>
                                        </Tooltip>
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
