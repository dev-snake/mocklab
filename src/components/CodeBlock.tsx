import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CodeBlockProps {
    code: string;
    language?: 'json' | 'typescript' | 'javascript';
    showLineNumbers?: boolean;
    maxHeight?: string;
}

export const CodeBlock = ({
    code,
    language = 'json',
    showLineNumbers = true,
    maxHeight = '500px',
}: CodeBlockProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const lines = code.split('\n');

    // Enhanced syntax highlighting with proper escaping
    const highlightLine = (line: string) => {
        // First, escape HTML entities
        let highlighted = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        // For JSON - highlight strings with their quotes (do this first to protect content)
        if (language === 'json') {
            // String values (after colon)
            highlighted = highlighted.replace(
                /:\s*"([^"]*)"/g,
                ': <span class="text-green-600 dark:text-green-400">"$1"</span>'
            );

            // Property keys (before colon)
            highlighted = highlighted.replace(
                /"([^"]+)":/g,
                '<span class="text-sky-600 dark:text-sky-400 font-medium">"$1"</span>:'
            );

            // Numbers
            highlighted = highlighted.replace(
                /:\s*(\d+\.?\d*)/g,
                ': <span class="text-blue-600 dark:text-blue-400 font-semibold">$1</span>'
            );

            // Booleans and null
            highlighted = highlighted.replace(
                /:\s*(true|false|null)/g,
                ': <span class="text-orange-500 dark:text-orange-400 font-semibold">$1</span>'
            );
        } else {
            // For TypeScript/JavaScript - use markers to prevent double-replacement
            const MARKER = '___SPAN___';
            const spans: string[] = [];
            let spanIndex = 0;

            // Helper to store span and return marker
            const storeSpan = (span: string) => {
                spans.push(span);
                return `${MARKER}${spanIndex++}${MARKER}`;
            };

            // 1. Keywords first (most specific)
            const keywords = [
                'interface',
                'export',
                'const',
                'let',
                'var',
                'function',
                'class',
                'import',
                'from',
                'type',
                'async',
                'await',
                'return',
                'new',
            ];
            keywords.forEach((keyword) => {
                const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
                highlighted = highlighted.replace(regex, (match) => {
                    return storeSpan(
                        `<span class="text-purple-600 dark:text-purple-400 font-semibold">${match}</span>`
                    );
                });
            });

            // 2. Strings with quotes (protect content inside strings)
            highlighted = highlighted.replace(/"([^"]*)"/g, (_match, content) => {
                return storeSpan(
                    `<span class="text-green-600 dark:text-green-400">"${content}"</span>`
                );
            });
            highlighted = highlighted.replace(/'([^"]*)'/g, (_match, content) => {
                return storeSpan(
                    `<span class="text-green-600 dark:text-green-400">'${content}'</span>`
                );
            });
            highlighted = highlighted.replace(/`([^`]*)`/g, (_match, content) => {
                return storeSpan(
                    `<span class="text-green-600 dark:text-green-400">\`${content}\`</span>`
                );
            });

            // 3. Numbers (standalone)
            highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, (match) => {
                return storeSpan(
                    `<span class="text-blue-600 dark:text-blue-400 font-semibold">${match}</span>`
                );
            });

            // 4. Booleans and special values
            highlighted = highlighted.replace(/\b(true|false|null|undefined)\b/g, (match) => {
                return storeSpan(
                    `<span class="text-orange-500 dark:text-orange-400 font-semibold">${match}</span>`
                );
            });

            // 5. Comments
            highlighted = highlighted.replace(/(\/\/.*$)/g, (match) => {
                return storeSpan(
                    `<span class="text-gray-500 dark:text-gray-400 italic">${match}</span>`
                );
            });

            // 6. Types (after colon in TS)
            highlighted = highlighted.replace(/:\s*([A-Z][a-zA-Z0-9]*)/g, (_match, type) => {
                return `: ${storeSpan(
                    `<span class="text-cyan-600 dark:text-cyan-400 font-medium">${type}</span>`
                )}`;
            });

            // Finally, restore all spans
            spans.forEach((span, index) => {
                highlighted = highlighted.replace(`${MARKER}${index}${MARKER}`, span);
            });
        }

        return highlighted;
    };

    const languageLabels = {
        json: 'JSON',
        typescript: 'TypeScript',
        javascript: 'JavaScript',
    };

    return (
        <div className="relative group border rounded-lg overflow-hidden bg-card shadow-sm">
            {/* Header with language label and copy button */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-muted/50 border-b backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
                        {languageLabels[language]}
                    </span>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-7 px-3 text-xs opacity-70 hover:opacity-100 transition-all hover:bg-background/80"
                >
                    {copied ? (
                        <>
                            <Check className="w-3.5 h-3.5 mr-1.5 text-green-500" />
                            <span className="text-green-600 dark:text-green-500 font-medium">
                                Copied!
                            </span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3.5 h-3.5 mr-1.5" />
                            Copy code
                        </>
                    )}
                </Button>
            </div>

            {/* Code content */}
            <ScrollArea className="w-full h-[500px]" >
                <div className="bg-muted/20 min-h-0">
                    <pre className="p-4 text-[13px] font-mono leading-relaxed overflow-x-auto">
                        <code className="block">
                            {lines.map((line, index) => (
                                <div
                                    key={index}
                                    className="table-row group/line hover:bg-accent/30 transition-colors min-w-0"
                                >
                                    {showLineNumbers && (
                                        <span className="table-cell pr-4 py-0.5 text-right select-none text-muted-foreground/50 w-12 font-medium text-xs align-top">
                                            {index + 1}
                                        </span>
                                    )}
                                    <span
                                        className="table-cell py-0.5 whitespace-pre-wrap break-all"
                                        dangerouslySetInnerHTML={{
                                            __html: highlightLine(line),
                                        }}
                                    />
                                </div>
                            ))}
                        </code>
                    </pre>
                </div>
            </ScrollArea>
        </div>
    );
};
