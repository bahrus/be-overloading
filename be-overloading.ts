import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {BEConfig} from 'be-enhanced/types';
import {XE} from 'xtal-element/XE.js';
import {Actions, AllProps, AP, PAP, ProPAP, POA, OnRule} from './types';
import {register} from 'be-hive/register.js';
import {parse} from 'be-exporting/be-exporting.js'

export class BeOverloading extends BE<AP, Actions, HTMLElement> implements Actions{
    static override get beConfig(){
        return {
            parse: true,
            parseAndCamelize: true,
            isParsedProp: 'isParsed'
        } as BEConfig;
    }

    async onCamelized(self: this): ProPAP {
        const {on, On} = self;
        let onRules: Array<OnRule> = [];
        if((on || On) !== undefined){
            const {prsOn} = await import('./prsOn.js');
            onRules = prsOn(self);
        }
        return {
            onRules
        }
    }

    async hydrate(self: this): ProPAP {
        const {onRules, enhancedElement} = self;
        const names = onRules.flat();
        //const {onload} = (enhancedElement as HTMLElement);
        //const onloadStr = onload?.toString();
        const onloadAttr = enhancedElement.getAttribute('onload')?.trim();
        console.log({onloadAttr});
        if(onloadAttr?.startsWith('(')){
            throw 'NI';
        }else if(onloadAttr?.startsWith('e =>')){

        }else{
            const wrappedJS = `export const onload = async ($0, context) => {
                const fn = () => {
                    ${onloadAttr}
                }
                const {events} = context; // events = ['click']
                if(events !== undefined){
                    for(const event of events){
                        const ab = new AbortController();
                        context.abortControllers[event] = ab;
                        $0.addEventListener(event, e => {
                            fn();
                        }, {signal: ab.signal});
                    }
                }
            }`;
            const exports = await parse(wrappedJS);
            console.log({exports});
        }
        return {
            resolved: true,
        }
    }
}

export interface BeOverloading extends AllProps{}

const tagName = 'be-overloading'
const ifWantsToBe = 'overloading';
const upgrade = '*';

const xe = new XE<AP, Actions>({
    config:{
        tagName,
        isEnh: true,
        propDefaults:{
            ...propDefaults,
        },
        propInfo: {
            ...propInfo,
        },
        actions: {
            onCamelized: {
                ifAllOf: ['isParsed'],
                ifAtLeastOneOf: ['on', 'On']
            },
            hydrate: 'onRules'
        }
    },
    superclass: BeOverloading
});

register(ifWantsToBe, upgrade, tagName);


