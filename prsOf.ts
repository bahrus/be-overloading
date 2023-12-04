import {AP, ProPAP, PAP, OnRule, WithNotFullyParsedRule} from './types';
import {RegExpOrRegExpExt} from 'be-enhanced/types';
import {arr, tryParse} from 'be-enhanced/cpu.js';

const reOfWithStatement: Array<RegExpOrRegExpExt<Partial<OnRule>>> = [
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

export function prsOf(self: AP) : Array<OnRule> {
    const {Of, of} = self;
    const both = [...(Of || []), ...(of || [])];
    const exportingRules: Array<OnRule> = [];
    for(const withStatement of both){
        const test = tryParse(withStatement, reOfWithStatement) as WithNotFullyParsedRule;
        if(test === null) throw 'PE';
        const {commaDelimitedNames, triggerType} = test;
        switch(triggerType){
            case 'Events':{
                const names = commaDelimitedNames.split(',').map(x => x.trim());
                exportingRules.push({
                    names,
                });
                break;
            }

            case 'Event':{
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