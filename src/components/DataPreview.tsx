import { useState } from 'react';
import { Copy, Download, Code2, FileJson, FileCode } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { CodeBlock } from '@/components/CodeBlock';
import { useMockStore } from '@/stores/mockStore';
import {
    formatAsJSON,
    formatAsTypeScript,
    formatAsJavaScript,
    formatAsZodSchema,
} from '@/core/utils/mock-generator';
import {
    Empty,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
    EmptyDescription,
} from '@/components/ui/empty';

export const DataPreview = () => {
    const { t } = useTranslation();
    const { generatedData, schema } = useMockStore();
    const [activeTab, setActiveTab] = useState<
        'json' | 'typescript' | 'javascript' | 'zod' | 'table'
    >('table');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        let content = '';
        switch (activeTab) {
            case 'json':
                content = formatAsJSON(generatedData);
                break;
            case 'typescript':
                content = formatAsTypeScript(generatedData, schema);
                break;
            case 'javascript':
                content = formatAsJavaScript(generatedData);
                break;
            case 'zod':
                content = formatAsZodSchema(schema);
                break;
            case 'table':
                content = formatAsJSON(generatedData);
                break;
        }

        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        let content = '';
        let filename = '';

        switch (activeTab) {
            case 'json':
                content = formatAsJSON(generatedData);
                filename = 'mock-data.json';
                break;
            case 'typescript':
                content = formatAsTypeScript(generatedData, schema);
                filename = 'mock-data.ts';
                break;
            case 'javascript':
                content = formatAsJavaScript(generatedData);
                filename = 'mock-data.js';
                break;
            case 'zod':
                content = formatAsZodSchema(schema);
                filename = 'schema.ts';
                break;
            case 'table':
                content = formatAsJSON(generatedData);
                filename = 'mock-data.json';
                break;
        }

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (generatedData.length === 0) {
        return (
            <div className="flex flex-col h-full">
                <div className="p-3 sm:p-4 border-b">
                    <h3 className="text-base sm:text-lg font-semibold">{t('dataPreview.title')}</h3>
                </div>
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <Code2 />
                        </EmptyMedia>
                        <EmptyTitle>{t('dataPreview.noData')}</EmptyTitle>
                        <EmptyDescription>{t('dataPreview.noDataDesc')}</EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </div>
        );
    }
    return (
        <div className="flex flex-col h-full">
            <div className="p-3 sm:p-4 border-b">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base sm:text-lg font-semibold">{t('dataPreview.title')}</h3>
                    <div className="flex gap-1 sm:gap-2">
                        <Button
                            variant="outline"
                            className="hover:cursor-pointer rounded-none text-xs sm:text-sm"
                            size="sm"
                            onClick={handleCopy}
                        >
                            <Copy className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                            <span className="hidden sm:inline">
                                {copied ? t('common.copied') : t('common.copy')}
                            </span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="hover:cursor-pointer rounded-none text-xs sm:text-sm"
                            onClick={handleDownload}
                        >
                            <Download className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                            <span className="hidden sm:inline">{t('dataPreview.download')}</span>
                        </Button>
                    </div>
                </div>
            </div>

            <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as any)}
                className="flex-1 flex flex-col"
            >
                <div className="border-b px-2 sm:px-4 py-2">
                    <TabsList className="rounded-none w-full sm:w-auto overflow-x-auto">
                        <TabsTrigger
                            value="table"
                            className="hover:cursor-pointer rounded-none text-xs sm:text-sm px-2 sm:px-3"
                        >
                            <FileJson className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                            <span className="hidden sm:inline">{t('dataPreview.table')}</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="json"
                            className="hover:cursor-pointer rounded-none text-xs sm:text-sm px-2 sm:px-3"
                        >
                            <FileJson className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                            <span className="hidden sm:inline">{t('dataPreview.json')}</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="typescript"
                            className="hover:cursor-pointer rounded-none text-xs sm:text-sm px-2 sm:px-3"
                        >
                            <FileCode className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                            <span className="hidden sm:inline">{t('dataPreview.typescript')}</span>
                            <span className="sm:hidden">TS</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="javascript"
                            className="hover:cursor-pointer rounded-none text-xs sm:text-sm px-2 sm:px-3"
                        >
                            <FileCode className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                            <span className="hidden sm:inline">{t('dataPreview.javascript')}</span>
                            <span className="sm:hidden">JS</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="zod"
                            className="hover:cursor-pointer rounded-none text-xs sm:text-sm px-2 sm:px-3"
                        >
                            <FileCode className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                            <span className="hidden sm:inline">{t('dataPreview.zod')}</span>
                            <span className="sm:hidden">Zod</span>
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 overflow-hidden">
                    <TabsContent value="table" className="h-full m-0">
                        <ScrollArea className="h-full">
                            <div className="p-2 sm:p-4">
                                <div className="border rounded-none overflow-hidden overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-muted">
                                            <TableRow>
                                                <TableHead className="w-12 sm:w-16 text-xs sm:text-sm">
                                                    #
                                                </TableHead>
                                                {Object.keys(generatedData[0] || {}).map((key) => (
                                                    <TableHead
                                                        key={key}
                                                        className="text-xs sm:text-sm"
                                                    >
                                                        {key}
                                                    </TableHead>
                                                ))}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {generatedData.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="text-muted-foreground font-medium text-xs sm:text-sm">
                                                        {index + 1}
                                                    </TableCell>
                                                    {Object.values(item).map((value: any, i) => (
                                                        <TableCell
                                                            key={i}
                                                            className="text-xs sm:text-sm"
                                                        >
                                                            {typeof value === 'bigint'
                                                                ? value.toString()
                                                                : typeof value === 'symbol'
                                                                ? value.toString()
                                                                : typeof value === 'object' &&
                                                                  value !== null
                                                                ? JSON.stringify(value)
                                                                : String(value)}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="json" className="h-full m-0 p-2 sm:p-4">
                        <CodeBlock code={formatAsJSON(generatedData)} language="json" />
                    </TabsContent>

                    <TabsContent value="typescript" className="h-full m-0 p-2 sm:p-4">
                        <CodeBlock
                            code={formatAsTypeScript(generatedData, schema)}
                            language="typescript"
                        />
                    </TabsContent>

                    <TabsContent value="javascript" className="h-full m-0 p-2 sm:p-4">
                        <CodeBlock code={formatAsJavaScript(generatedData)} language="javascript" />
                    </TabsContent>

                    <TabsContent value="zod" className="h-full m-0 p-2 sm:p-4">
                        <CodeBlock code={formatAsZodSchema(schema)} language="typescript" />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
};
