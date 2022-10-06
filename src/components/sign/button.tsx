import { SearchIcon } from '@/components/icons/search';
import { useModal } from '@/components/modal-views/context';
import Button from '@/components/ui/button';

export default function SignButton({ ...props }) {
  const { openModal } = useModal();
  // const slugModal =
  return (
    <>
      <Button
        {...props}
        onClick={() => alert()}
        shape="circle"
        aria-label="Search"
      >
        <SearchIcon className="h-auto w-3.5 sm:w-auto" />
      </Button>
    </>
  );
}
