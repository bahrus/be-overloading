import {AP, ProPAP, PAP, OnRule, WithNotFullyParsedRule} from './types';
import {RegExpOrRegExpExt} from 'be-enhanced/types';
import {arr, tryParse} from 'be-enhanced/cpu.js';

const reOfWithStatement: Array<RegExpOrRegExpExt<Partial<OnRule>>> = [
    {
        regExp: new RegExp(String.raw `^(?<commaDelimitedNames>.*)Events`),
        defaultVals: {
            triggerType: 'Events'
        }
    }
];

export function prsOn(self: AP) : Array<OnRule> {
    const {On, on} = self;
    const both = [...(On || []), ...(on || [])];
    const exportingRules: Array<OnRule> = [];
    for(const withStatement of both){
        const test = tryParse(withStatement, reOfWithStatement) as WithNotFullyParsedRule;
        if(test === null) throw 'PE';
        const {commaDelimitedNames} = test;
        const names = commaDelimitedNames.split(',').map(x => x.trim());
        exportingRules.push({
            names,
        });
    }
    return exportingRules;
}