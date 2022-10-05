import { SearchIcon } from '@/components/icons/search';
import { useModal } from '@/components/modal-views/context';
import Button from '@/components/ui/button';

export default function SearchButton({ ...props }) {
  const { openModal } = useModal();
  return (
    <Button
      {...props}
      onClick={() => openModal('SEARCH_VIEW')}
      shape="circle"
      aria-label="Search"
    >
      <SearchIcon className="h-auto w-3.5 sm:w-auto" />
    </Button>
  );
}
