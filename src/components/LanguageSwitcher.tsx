import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const LanguageSwitcher = () => {
    const { i18n, t } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-none hover:cursor-pointer">
                    <Languages className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-none">
                <DropdownMenuItem onClick={() => changeLanguage('en')} className="rounded-none">
                    🇺🇸 {t('language.english')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('vi')} className="rounded-none">
                    🇻🇳 {t('language.vietnamese')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
