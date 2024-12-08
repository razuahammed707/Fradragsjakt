import { Button } from '@/components/ui/button';
import FilterSelectField from './ExpenseFilterStyle'; // Import the new reusable component

export function FilterContent() {
  const categories = [
    { value: 'transport', label: 'Transport' },
    { value: 'food', label: 'Food' },
    { value: 'accommodation', label: 'Accommodation' },
  ];

  const types = [
    { value: 'business', label: 'Business' },
    { value: 'personal', label: 'Personal' },
  ];

  const months = [
    { value: 'january', label: 'January' },
    { value: 'february', label: 'February' },
    { value: 'march', label: 'March' },
    { value: 'april', label: 'April' },
    { value: 'may', label: 'May' },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-[564px]">
        <h2
          className="text-xl font-semibold mb-4"
          style={{ color: 'var(--violet, #5B52F9)' }}
        >
          Filter by
        </h2>

        <FilterSelectField
          label="Category"
          placeholder="Transport"
          items={categories}
        />
        <FilterSelectField label="Type" placeholder="Business" items={types} />
        <FilterSelectField label="Month" placeholder="January" items={months} />

        <Button className="w-full text-white mt-4" variant={'purple'}>
          Apply
        </Button>
      </div>
    </div>
  );
}
