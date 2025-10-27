import { Wand2, RefreshCw, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useMockStore } from '@/stores/mockStore';
import type { GeneratorType } from '@/core/utils/mock-generator';
import { Separator } from '@/components/ui/separator';

export const GeneratorOptions = () => {
    const { t } = useTranslation();
    const {
        generatorOptions,
        setGeneratorOptions,
        generateData,
        clearData,
        schema,
        generatedData,
    } = useMockStore();

    const handleGenerate = () => {
        if (schema.length === 0) {
            alert(t('messages.fieldRequired'));
            return;
        }
        generateData();
    };

    const generatorTypesWithTranslation = [
        {
            value: 'random' as GeneratorType,
            label: t('generatorTypes.random'),
            description: t('generatorTypes.randomDesc'),
            icon: <RefreshCw className="inline-block w-4 h-4 mr-1" />,
        },
        {
            value: 'realistic' as GeneratorType,
            label: t('generatorTypes.realistic'),
            description: t('generatorTypes.realisticDesc'),
            icon: <Wand2 className="inline-block w-4 h-4 mr-1" />,
        },
        {
            value: 'sequential' as GeneratorType,
            label: t('generatorTypes.sequential'),
            description: t('generatorTypes.sequentialDesc'),
            icon: <Trash2 className="inline-block w-4 h-4 mr-1" />,
        },
        {
            value: 'template' as GeneratorType,
            label: t('generatorTypes.template'),
            description: t('generatorTypes.templateDesc'),
            icon: <Wand2 className="inline-block w-4 h-4 mr-1" />,
        },
    ];

    return (
        <div className="p-4 space-y-4 border-b bg-card">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">{t('generatorOptions.title')}</h3>
                {generatedData.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                        {t('messages.generateSuccess', { count: generatedData.length })}
                    </span>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="generator-type">{t('generatorOptions.generatorType')}</Label>
                    <Select
                        value={generatorOptions.type}
                        onValueChange={(value) =>
                            setGeneratorOptions({ type: value as GeneratorType })
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={t('generatorOptions.generatorType')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>{t('generatorOptions.generatorType')}</SelectLabel>
                                {generatorTypesWithTranslation.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.icon} {type.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                        {
                            generatorTypesWithTranslation.find(
                                (t) => t.value === generatorOptions.type
                            )?.description
                        }
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="generator-count">{t('generatorOptions.count')}</Label>
                    <Input
                        id="generator-count"
                        type="number"
                        min="1"
                        max="1000"
                        placeholder={t('generatorOptions.countPlaceholder')}
                        value={generatorOptions.count}
                        onChange={(e) =>
                            setGeneratorOptions({ count: parseInt(e.target.value) || 10 })
                        }
                    />
                    <p className="text-xs text-muted-foreground">
                        {t('generatorOptions.countPlaceholder')}
                    </p>
                </div>
            </div>

            <Separator />

            <div className="flex gap-2">
                <Button onClick={handleGenerate} className="flex-1" disabled={schema.length === 0}>
                    <Wand2 className="w-4 h-4 mr-2" />
                    {t('generatorOptions.generateData')}
                </Button>

                {generatedData.length > 0 && (
                    <>
                        <Button variant="outline" onClick={handleGenerate}>
                            <RefreshCw className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" onClick={clearData}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </>
                )}
            </div>

            {/* Quick Stats */}
            {generatedData.length > 0 && (
                <div className="grid grid-cols-3 gap-2 pt-2">
                    <div className="text-center p-2 bg-primary/5 rounded">
                        <div className="text-lg font-bold">{generatedData.length}</div>
                        <div className="text-xs text-muted-foreground">Records</div>
                    </div>
                    <div className="text-center p-2 bg-primary/5 rounded">
                        <div className="text-lg font-bold">{schema.length}</div>
                        <div className="text-xs text-muted-foreground">Fields</div>
                    </div>
                    <div className="text-center p-2 bg-primary/5 rounded">
                        <div className="text-lg font-bold">
                            {(JSON.stringify(generatedData).length / 1024).toFixed(1)}KB
                        </div>
                        <div className="text-xs text-muted-foreground">Size</div>
                    </div>
                </div>
            )}
        </div>
    );
};
