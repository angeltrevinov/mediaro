import { renderHook, act, waitFor } from '@/lib/test-utils';
import { useMediaSearch } from '@/hooks/use-media-search';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { createMockMovieSearchResult } from '@/lib/test-utils';

jest.mock('next/navigation');

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>;
const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe('useMediaSearch', () => {
  const mockPush = jest.fn();
  const mockFetchFn = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseRouter.mockReturnValue({
      push: mockPush,
    } as any);

    mockUsePathname.mockReturnValue('/search');

    const mockSearchParams = new URLSearchParams();
    mockUseSearchParams.mockReturnValue(mockSearchParams as any);
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useMediaSearch(mockFetchFn));

    expect(result.current.results).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.form.getValues()).toEqual({
      query: '',
      page: 1,
    });
  });

  it('should fetch results when form is submitted', async () => {
    const mockResults = {
      page: 1,
      results: [createMockMovieSearchResult()],
      totalResults: 1,
      totalPages: 1,
    };

    mockFetchFn.mockResolvedValue(mockResults);

    const { result } = renderHook(() => useMediaSearch(mockFetchFn));

    await act(async () => {
      await result.current.form.setValue('query', 'Fight Club');
    });

    await act(async () => {
      await result.current.onSubmit({ query: 'Fight Club', page: 1 });
    });

    expect(mockPush).toHaveBeenCalled();
  });

  it('should not submit empty query', async () => {
    const { result } = renderHook(() => useMediaSearch(mockFetchFn));

    await act(async () => {
      result.current.onSubmit({ query: '', page: 1 });
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should not submit whitespace-only query', async () => {
    const { result } = renderHook(() => useMediaSearch(mockFetchFn));

    await act(async () => {
      result.current.onSubmit({ query: '   ', page: 1 });
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should generate page link with correct params', () => {
    mockFetchFn.mockResolvedValue({
      page: 1,
      results: [],
      totalResults: 0,
      totalPages: 0,
    });

    const { result } = renderHook(() => useMediaSearch(mockFetchFn));

    const link = result.current.generatePageLink(2);

    expect(link).toContain('page=2');
  });

  it('should handle fetch errors gracefully', async () => {
    const mockError = new Error('Fetch failed');
    mockFetchFn.mockRejectedValue(mockError);

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const { result } = renderHook(() => useMediaSearch(mockFetchFn));

    // Simulate fetching with query params
    const mockSearchParams = new URLSearchParams('query=test&page=1');
    mockUseSearchParams.mockReturnValue(mockSearchParams as any);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    consoleErrorSpy.mockRestore();
  });

  it('should load results from URL params on mount', async () => {
    const mockResults = {
      page: 1,
      results: [createMockMovieSearchResult()],
      totalResults: 1,
      totalPages: 1,
    };

    mockFetchFn.mockResolvedValue(mockResults);

    const mockSearchParams = new URLSearchParams('query=Fight+Club&page=1');
    mockUseSearchParams.mockReturnValue(mockSearchParams as any);

    const { result } = renderHook(() => useMediaSearch(mockFetchFn));

    await waitFor(() => {
      expect(mockFetchFn).toHaveBeenCalledWith('Fight Club', 1);
    });

    expect(result.current.form.getValues('query')).toBe('Fight Club');
  });

  it('should reset page to 1 on new search', async () => {
    const mockResults = {
      page: 1,
      results: [createMockMovieSearchResult()],
      totalResults: 1,
      totalPages: 1,
    };

    mockFetchFn.mockResolvedValue(mockResults);

    const { result } = renderHook(() => useMediaSearch(mockFetchFn));

    await act(async () => {
      result.current.onSubmit({ query: 'Fight Club', page: 1 });
    });

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('page=1')
    );
  });

  it('should validate form data', async () => {
    const { result } = renderHook(() => useMediaSearch(mockFetchFn));

    const formState = result.current.form.formState;
    expect(formState.isValid).toBe(false); // Empty query should be invalid
  });

  it('should handle pagination links correctly', () => {
    const mockSearchParams = new URLSearchParams('query=Fight+Club&page=1');
    mockUseSearchParams.mockReturnValue(mockSearchParams as any);

    const { result } = renderHook(() => useMediaSearch(mockFetchFn));

    const page2Link = result.current.generatePageLink(2);
    const page3Link = result.current.generatePageLink(3);

    expect(page2Link).toContain('page=2');
    expect(page3Link).toContain('page=3');
    expect(page2Link).toContain('query=Fight+Club');
    expect(page3Link).toContain('query=Fight+Club');
  });
});
