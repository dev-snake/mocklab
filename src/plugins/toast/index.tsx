import { Toaster } from '@/components/ui/sonner';
import { type ReactNode } from 'react';


export function withToast(children: ReactNode) {
    return (
        <>
            {children}
            <Toaster />
        </>
    );
}
