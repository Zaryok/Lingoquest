import { Language, SUPPORTED_LANGUAGES } from '@/types';

export const getLanguageByCode = (code: string): Language | undefined => {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
};

export const saveLanguagePreferences = (sourceLanguage: string, targetLanguage: string) => {
  localStorage.setItem('selectedLanguages', JSON.stringify({
    sourceLanguage,
    targetLanguage
  }));
};

export const getLanguagePreferences = () => {
  const saved = localStorage.getItem('selectedLanguages');
  return saved ? JSON.parse(saved) : null;
};

export const clearLanguagePreferences = () => {
  localStorage.removeItem('selectedLanguages');
};

export const formatLanguagePair = (sourceCode: string, targetCode: string): string => {
  const source = getLanguageByCode(sourceCode);
  const target = getLanguageByCode(targetCode);
  
  if (!source || !target) return '';
  
  return `${source.flag} ${source.name} → ${target.flag} ${target.name}`;
};
