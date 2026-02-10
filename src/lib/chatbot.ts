import fs from 'fs';
import path from 'path';

export interface KnowledgeItem {
    id: string;
    topics: string[];
    keywords: string[];
    answer: string;
    isActive: boolean;
    isSuggestion?: boolean;
}

const DATA_FILE = path.join(process.cwd(), 'src/data/chatbot-knowledge.json');

export function getKnowledgeBase(): KnowledgeItem[] {
    try {
        const fileContents = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(fileContents);
    } catch (error) {
        console.error("Error reading knowledge base:", error);
        return [];
    }
}

export function saveKnowledgeBase(data: KnowledgeItem[]): boolean {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error("Error saving knowledge base:", error);
        return false;
    }
}

export function addKnowledgeItem(item: Omit<KnowledgeItem, 'id'>): KnowledgeItem {
    const currentData = getKnowledgeBase();
    const newItem: KnowledgeItem = {
        ...item,
        id: Date.now().toString(), // Simple ID generation
    };

    currentData.push(newItem);
    saveKnowledgeBase(currentData);
    return newItem;
}

export function updateKnowledgeItem(id: string, updates: Partial<KnowledgeItem>): KnowledgeItem | null {
    const currentData = getKnowledgeBase();
    const index = currentData.findIndex(item => item.id === id);

    if (index === -1) return null;

    const updatedItem = { ...currentData[index], ...updates };
    currentData[index] = updatedItem;
    saveKnowledgeBase(currentData);
    return updatedItem;
}

export function deleteKnowledgeItem(id: string): boolean {
    let currentData = getKnowledgeBase();
    const initialLength = currentData.length;
    currentData = currentData.filter(item => item.id !== id);

    if (currentData.length === initialLength) return false;

    return saveKnowledgeBase(currentData);
}
