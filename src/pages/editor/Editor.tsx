import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { SchemaBuilder } from '@/components/SchemaBuilder';
import { GeneratorOptions } from '@/components/GeneratorOptions';
import { DataPreview } from '@/components/DataPreview';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export const Editor = () => {
    const { t } = useTranslation();

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <header className="border-b">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">MockLab</h1>
                        <p className="text-sm text-muted-foreground">
                            {t('dataPreview.noDataDesc')}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <LanguageSwitcher />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
                <ResizablePanelGroup direction="horizontal" className="min-h-0">
                    {/* Left Panel - Schema Builder */}
                    <ResizablePanel defaultSize={30} minSize={25} maxSize={50}>
                        <div className="h-full border-r">
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
