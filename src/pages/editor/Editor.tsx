import { useState } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { SchemaBuilder } from '@/components/SchemaBuilder';
import { GeneratorOptions } from '@/components/GeneratorOptions';
import { DataPreview } from '@/components/DataPreview';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const Editor = () => {
    const [mobileTab, setMobileTab] = useState<'schema' | 'generator' | 'preview'>('schema');

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <header className="border-b px-2 sm:px-4 py-2 flex items-center justify-between bg-background">
                <div className="flex items-center gap-2">
                    <h1 className="text-lg sm:text-xl font-bold hidden sm:block">MockLab</h1>
                    <h1 className="text-base font-bold sm:hidden">MockLab</h1>
                </div>
                <LanguageSwitcher />
            </header>

            {/* Mobile View - Tabs */}
            <div className="flex-1 overflow-hidden lg:hidden">
                <Tabs
                    value={mobileTab}
                    onValueChange={(v) => setMobileTab(v as any)}
                    className="h-full flex flex-col"
                >
                    <div className="border-b px-2 py-2">
                        <TabsList className="grid w-full grid-cols-3 rounded-none">
                            <TabsTrigger value="schema" className="rounded-none text-xs sm:text-sm">
                                Schema
                            </TabsTrigger>
                            <TabsTrigger
                                value="generator"
                                className="rounded-none text-xs sm:text-sm"
                            >
                                Generate
                            </TabsTrigger>
                            <TabsTrigger
                                value="preview"
                                className="rounded-none text-xs sm:text-sm"
                            >
                                Preview
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="schema" className="flex-1 overflow-hidden m-0">
                        <SchemaBuilder />
                    </TabsContent>

                    <TabsContent value="generator" className="flex-1 overflow-hidden m-0">
                        <div className="h-full flex flex-col">
                            <GeneratorOptions />
                            <div className="flex-1 overflow-hidden">
                                <DataPreview />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="preview" className="flex-1 overflow-hidden m-0">
                        <DataPreview />
                    </TabsContent>
                </Tabs>
            </div>

            {/* Desktop View - Resizable Panels */}
            <div className="flex-1 overflow-hidden hidden lg:block">
                <ResizablePanelGroup direction="horizontal" className="min-h-0">
                    {/* Left Panel - Schema Builder */}
                    <ResizablePanel defaultSize={30} minSize={25} maxSize={50}>
                        <div className="h-full">
                            <SchemaBuilder />
                        </div>
                    </ResizablePanel>

                    <ResizableHandle
                        withHandle
                        className="hover:bg-primary/20 active:bg-primary/30 transition-colors"
                    />

                    {/* Right Panel - Generator & Preview */}
                    <ResizablePanel defaultSize={70} minSize={40}>
                        <ResizablePanelGroup direction="vertical" className="min-h-0">
                            {/* Generator Options */}
                            <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
                                <GeneratorOptions />
                            </ResizablePanel>

                            <ResizableHandle
                                withHandle
                                className="hover:bg-primary/20 active:bg-primary/30 transition-colors"
                            />

                            {/* Data Preview */}
                            <ResizablePanel defaultSize={75} minSize={50}>
                                <DataPreview />
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
    );
};
