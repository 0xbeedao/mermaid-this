import { determineModel, DEFAULT_MODEL } from '../src/model-parser.ts';
import { describe, it, expect } from 'bun:test';

describe('determineModel', () => {
    it('should return the default model for empty string', () => {
        const model = determineModel('');
        expect(model).toBeDefined();
    });

    it('should parse openai:gpt-4o-mini', () => {
        const model = determineModel('openai:gpt-4o-mini');
        expect(model).toBeDefined();
        expect(model).toEqual(DEFAULT_MODEL);
    });

    it('should parse http://localhost:11434/v1:deepseek-coder', () => {
        const model = determineModel('http://localhost:11434/v1:deepseek-coder');
        expect(model).toBeDefined();
        expect(model.modelName).toBe('deepseek-coder');
        expect(model.provider).toBe('http://localhost:11434/v1');
        expect(model.providerType).toBe('openai');
    });

    it('should parse ollama:llama3.1:8b', () => {
        const model = determineModel('ollama:llama3.1:8b');
        expect(model).toBeDefined();
        expect(model.modelName).toBe('llama3.1:8b');
        expect(model.provider).toBe('ollama');
        expect(model.providerType).toBe('ollama');
    });
});