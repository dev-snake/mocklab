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
import { formatAsJSON, formatAsTypeScript, formatAsJavaScript } from '@/core/utils/mock-generator';
import {
    Empty,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
    EmptyDescription,
} from '@/components/ui/empty';

export const DataPreview = () => {
    const { t } = useTranslation();
    const { generatedData } = useMockStore();
    const [activeTab, setActiveTab] = useState<'json' | 'typescript' | 'javascript' | 'table'>(
        'table'
    );
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        let content = '';
        switch (activeTab) {
            case 'json':
                content = formatAsJSON(generatedData);
                break;
            case 'typescript':
                content = formatAsTypeScript(generatedData);
                break;
            case 'javascript':
                content = formatAsJavaScript(generatedData);
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
                content = formatAsTypeScript(generatedData);
                filename = 'mock-data.ts';
                break;
            case 'javascript':
                content = formatAsJavaScript(generatedData);
                filename = 'mock-data.js';
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
                <div className="p-4 border-b">
                    <h3 className="text-lg font-semibold">{t('dataPreview.title')}</h3>
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
            <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{t('dataPreview.title')}</h3>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="hover:cursor-pointer"
                            size="sm"
                            onClick={handleCopy}
                        >
                            <Copy className="w-4 h-4 mr-2" />
                            {copied ? t('common.copied') : t('common.copy')}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="hover:cursor-pointer"
                            onClick={handleDownload}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            {t('dataPreview.download')}
                        </Button>
                    </div>
                </div>
            </div>

            <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as any)}
                className="flex-1 flex flex-col"
            >
                <div className="border-b px-4 py-2">
                    <TabsList>
                        <TabsTrigger value="table" className="hover:cursor-pointer">
                            <FileJson className="w-4 h-4 mr-2" />
                            {t('dataPreview.table')}
                        </TabsTrigger>
                        <TabsTrigger value="json" className="hover:cursor-pointer">
                            <FileJson className="w-4 h-4 mr-2" />
                            {t('dataPreview.json')}
                        </TabsTrigger>
                        <TabsTrigger value="typescript" className="hover:cursor-pointer">
                            <FileCode className="w-4 h-4 mr-2" />
                            {t('dataPreview.typescript')}
                        </TabsTrigger>
                        <TabsTrigger value="javascript" className="hover:cursor-pointer">
                            <FileCode className="w-4 h-4 mr-2" />
                            {t('dataPreview.javascript')}
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 overflow-hidden">
                    <TabsContent value="table" className="h-full m-0">
                        <ScrollArea className="h-full">
                            <div className="p-4">
                                <div className="border rounded-lg overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-muted">
                                            <TableRow>
                                                <TableHead className="w-16">#</TableHead>
                                                {Object.keys(generatedData[0] || {}).map((key) => (
                                                    <TableHead key={key}>{key}</TableHead>
                                                ))}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {generatedData.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="text-muted-foreground font-medium">
                                                        {index + 1}
                                                    </TableCell>
                                                    {Object.values(item).map((value: any, i) => (
                                                        <TableCell key={i}>
                                                            {typeof value === 'object'
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

                    <TabsContent value="json" className="h-full m-0 p-4">
                        <CodeBlock code={formatAsJSON(generatedData)} language="json" />
                    </TabsContent>

                    <TabsContent value="typescript" className="h-full m-0 p-4">
                        <CodeBlock code={formatAsTypeScript(generatedData)} language="typescript" />
                    </TabsContent>

                    <TabsContent value="javascript" className="h-full m-0 p-4">
                        <CodeBlock code={formatAsJavaScript(generatedData)} language="javascript" />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
};
