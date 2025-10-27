import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { SchemaBuilder } from '@/components/SchemaBuilder';
import { GeneratorOptions } from '@/components/GeneratorOptions';
import { DataPreview } from '@/components/DataPreview';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export const Editor = () => {

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <header className="border-b px-2 py-1 flex items-center justify-end bg-background">
                <LanguageSwitcher />
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
