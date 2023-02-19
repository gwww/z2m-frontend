import { describe, it, expect } from 'vitest';
import * as Case from './case';

describe('Camel case', () => {
    it('Simple test', () => {
        expect(Case.camel2Title('simpleTest')).toBe('Simple Test');
    });
    it('Test single letter', () => {
        expect(Case.camel2Title('thisIsALongerTest')).toBe('This Is A Longer Test');
    });
    it('Test number', () => {
        expect(Case.camel2Title('thisIs6ALongerTest')).toBe('This Is 6 A Longer Test');
    });
    it('Test number again', () => {
        expect(Case.camel2Title('thisIsA7LongerTest')).toBe('This Is A 7 Longer Test');
    });
});

describe('Snake case', () => {
    it('Simple test', () => {
        expect(Case.snake2Title('simple_test')).toBe('Simple Test');
    });
    it('Test single letter', () => {
        expect(Case.snake2Title('this_is_a_longer_test')).toBe('This Is A Longer Test');
    });
    it('Test number', () => {
        expect(Case.snake2Title('this_is_6_a_longer_test')).toBe('This Is 6 A Longer Test');
    });
    it('Test number again', () => {
        expect(Case.snake2Title('this_is_a_7_longer_test')).toBe('This Is A 7 Longer Test');
    });
});

describe('Auto detect', () => {
    it('Simple test', () => {
        expect(Case.any2Title('simple_test')).toBe('Simple Test');
    });
    it('Test number', () => {
        expect(Case.any2Title('thisIs6ALongerTest')).toBe('This Is 6 A Longer Test');
    });
});

describe('Exceptions', () => {
    it('Full exception', () => {
        expect(Case.any2Title('linkquality')).toBe('Link Quality');
    });
    it('Change LED embedded', () => {
        expect(Case.any2Title('thisIs6ALedTest')).toBe('This Is 6 A LED Test');
    });
    it('Change LED at start', () => {
        expect(Case.any2Title('led_test')).toBe('LED Test');
    });
    it('Change LED at end', () => {
        expect(Case.any2Title('testLed')).toBe('Test LED');
    });
});
