import { BE, propDefaults, propInfo } from 'be-enhanced/BE.js';
import { XE } from 'xtal-element/XE.js';
import { register } from 'be-hive/register.js';
export class BeOverloading extends BE {
    static get beConfig() {
        return {
            parse: true,
            parseAndCamelize: true,
            isParsedProp: 'isParsed'
        };
    }
    async onCamelized(self) {
        const { on, On } = self;
        let onRules = [];
        if ((on || On) !== undefined) {
            const { prsOn } = await import('./prsOn.js');
            onRules = prsOn(self);
        }
        return {
            onRules
        };
    }
    async hydrate(self) {
        return {
            resolved: true,
        };
    }
}
const tagName = 'be-overloading';
const ifWantsToBe = 'overloading';
const upgrade = '*';
const xe = new XE({
    config: {
        tagName,
        isEnh: true,
        propDefaults: {
            ...propDefaults,
        },
        propInfo: {
            ...propInfo,
        },
        actions: {
            onCamelized: {}
        }
    },
    superclass: BeOverloading
});
register(ifWantsToBe, upgrade, tagName);
