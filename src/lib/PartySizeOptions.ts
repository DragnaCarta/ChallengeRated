import type { RadioOption } from '@/types';

const PartySizeOptions: RadioOption[] = [];

/** Push simple values into array */
for (let i = 1; i <= 10; i++) {
    PartySizeOptions.push({ displayText: i.toString(), value: i });
}

export default PartySizeOptions;