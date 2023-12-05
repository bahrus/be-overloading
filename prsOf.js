import { tryParse, lc } from 'be-enhanced/cpu.js';
const reOfWithStatement = [
    {
        regExp: new RegExp(String.raw `^(?<commaDelimitedNames>.*)Events`),
        defaultVals: {
            triggerType: 'Events'
        }
    },
    {
        regExp: new RegExp(String.raw `^(?<commaDelimitedNames>.*)Event`),
        defaultVals: {
            triggerType: 'Event'
        }
    },
];
export function prsOf(self) {
    const { Of, of } = self;
    const both = [...(Of || []), ...(of || [])];
    const exportingRules = [];
    for (const withStatement of both) {
        const test = tryParse(withStatement, reOfWithStatement);
        if (test === null)
            throw 'PE';
        const { commaDelimitedNames, triggerType } = test;
        switch (triggerType) {
            case 'Events': {
                const names = commaDelimitedNames.split(',').map(x => lc(x.trim()));
                exportingRules.push({
                    names,
                });
                break;
            }
            case 'Event': {
                const names = [commaDelimitedNames];
                exportingRules.push({
                    names,
                });
                break;
            }
        }
    }
    return exportingRules;
}
