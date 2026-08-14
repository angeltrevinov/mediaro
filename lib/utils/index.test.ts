import { cn } from '@/lib/utils';

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1');
  });

  it('should handle conflicting tailwind classes', () => {
    // tailwind-merge should resolve conflicts by preferring the last one
    const result = cn('px-2', 'px-4');
    expect(result).toContain('px-4');
    expect(result).not.toContain('px-2');
  });

  it('should handle conditional classes with arrays', () => {
    expect(cn(['px-2', 'py-1'], 'text-lg')).toContain('px-2');
    expect(cn(['px-2', 'py-1'], 'text-lg')).toContain('py-1');
    expect(cn(['px-2', 'py-1'], 'text-lg')).toContain('text-lg');
  });

  it('should handle undefined and false values', () => {
    expect(cn('px-2', undefined, false, 'py-1')).toBe('px-2 py-1');
  });

  it('should handle objects with conditional classes', () => {
    expect(cn({ 'px-2': true, 'py-1': false })).toBe('px-2');
  });

  it('should handle empty input', () => {
    expect(cn()).toBe('');
  });

  it('should handle complex nested structures', () => {
    const result = cn(
      'px-2',
      { 'py-1': true, 'px-4': false },
      ['text-lg', undefined],
      false,
      'text-center'
    );
    expect(result).toContain('px-2');
    expect(result).toContain('py-1');
    expect(result).toContain('text-lg');
    expect(result).toContain('text-center');
  });
});
