import { fireEvent, render, screen, waitFor } from '@/lib/test-utils';
import { useForm } from 'react-hook-form';
import { MediaSearchForm, MediaSearchPagination } from './media-search';
import type { SearchFormValues } from '@/hooks/use-media-search';

describe('MediaSearchForm', () => {
  it('submits the current query', async () => {
    const onSubmit = jest.fn();

    function TestForm() {
      const form = useForm<SearchFormValues>({
        defaultValues: {
          query: '',
          page: 1,
        },
      });

      return <MediaSearchForm form={form} onSubmit={onSubmit} placeholder="Search movies" />;
    }

    render(<TestForm />);

    fireEvent.change(screen.getByPlaceholderText('Search movies'), {
      target: { value: 'matrix' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    expect(onSubmit.mock.calls[0][0]).toEqual({ query: 'matrix', page: 1 });
  });
});

describe('MediaSearchPagination', () => {
  it('renders page metadata and links for previous and next pages', () => {
    render(
      <MediaSearchPagination
        currentPage={2}
        totalPages={3}
        generatePageLink={(page) => `/search?page=${page}`}
      />
    );

    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
    const links = screen.getAllByRole('link');
    expect(links.some((link) => link.getAttribute('href') === '/search?page=1')).toBe(true);
    expect(links.some((link) => link.getAttribute('href') === '/search?page=3')).toBe(true);
  });
});
