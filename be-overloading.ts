import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {BEConfig} from 'be-enhanced/types';
import {XE} from 'xtal-element/XE.js';
import {Actions, AllProps, AP, PAP, ProPAP, POA, OnRule} from './types';
import {register} from 'be-hive/register.js';

export class BeOverloading extends BE<AP, Actions> implements Actions{
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

            }
        }
    },
    superclass: BeOverloading
});

register(ifWantsToBe, upgrade, tagName);


