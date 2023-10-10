import type { RadioOption } from '@/types';

const PartyLevelOptions: RadioOption[] = [];

/** Push simple values into array */
for (let i = 1; i <= 20; i++) {
    PartyLevelOptions.push({ displayText: i.toString(), value: i });
}

export default PartyLevelOptions;