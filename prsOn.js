import { tryParse } from 'be-enhanced/cpu.js';
const reOfWithStatement = [
    {
        regExp: new RegExp(String.raw `^(?<commaDelimitedNames>.*)Events`),
        defaultVals: {
            triggerType: 'Events'
        }
    }
];
export function prsOn(self) {
    const { On, on } = self;
    const both = [...(On || []), ...(on || [])];
    const exportingRules = [];
    for (const withStatement of both) {
        const test = tryParse(withStatement, reOfWithStatement);
        if (test === null)
            throw 'PE';
        const { commaDelimitedNames } = test;
        const names = commaDelimitedNames.split(',').map(x => x.trim());
        exportingRules.push({
            names,
        });
    }
    return exportingRules;
}
