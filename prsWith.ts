import {AP, ProPAP, PAP, WithRule, WithUnParsedRule} from './types';
import {RegExpOrRegExpExt} from 'be-enhanced/types';
import {arr, tryParse} from 'be-enhanced/cpu.js';

const reOfWithStatement: Array<RegExpOrRegExpExt<Partial<WithRule>>> = [
    {
        regExp: new RegExp(String.raw `^(?<commaDelimitedNames>.*)`),
        defaultVals: {}
    }
];

export function prsWith(self: AP) : Array<WithRule> {
    const {With, with: w} = self;
    const both = [...(With || []), ...(w || [])];
    const exportingRules: Array<WithRule> = [];
    for(const withStatement of both){
        const test = tryParse(withStatement, reOfWithStatement) as WithUnParsedRule;
        if(test === null) throw 'PE';
        const {commaDelimitedNames} = test;
        const names = commaDelimitedNames.split(',').map(x => x.trim());
        exportingRules.push({
            names
        });
    }
    return exportingRules;
}