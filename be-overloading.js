import { BE, propDefaults, propInfo } from 'be-enhanced/BE.js';
import { XE } from 'xtal-element/XE.js';
import { register } from 'be-hive/register.js';
import { parse } from 'be-exporting/be-exporting.js';
export class BeOverloading extends BE {
    static get beConfig() {
        return {
            parse: true,
            parseAndCamelize: true,
            isParsedProp: 'isParsed'
        };
    }
    async onCamelized(self) {
        const { of, Of } = self;
        let onRules = [];
        if ((of || Of) !== undefined) {
            const { prsOf } = await import('./prsOf.js');
            onRules = prsOf(self);
        }
        return {
            onRules
        };
    }
    async noAttrs(self) {
        return {
            onRules: []
        };
    }
    async hydrate(self) {
        const { onRules, enhancedElement } = self;
        let names = [];
        for (const onRule of onRules) {
            names = names.concat(onRule.names);
        }
        //const {onload} = (enhancedElement as HTMLElement);
        //const onloadStr = onload?.toString();
        const onloadAttr = enhancedElement.getAttribute('onload')?.trim();
        let wrappedJS;
        if (onloadAttr?.startsWith('(')) {
            wrappedJS = `export const onload = async ${onloadAttr}
            `;
        }
        else if (onloadAttr?.startsWith('e =>')) {
            wrappedJS = `export const onload = async ($0, context) => {
                const fn = ${onloadAttr}
                const {events} = context; // events = ['click']
                if(events !== undefined){
                    for(const event of events){
                        const ab = new AbortController();
                        context.abortControllers[event] = ab;
                        $0.addEventListener(event, fn, {signal: ab.signal});
                    }
                }
            }`;
        }
        else {
            wrappedJS = `export const onload = async ($0, context) => {
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
        }
        const exports = await parse(wrappedJS);
        const context = {
            events: names,
            abortControllers: []
        };
        const { onload } = exports;
        await onload(enhancedElement, context);
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
            noAttrs: {
                ifAllOf: ['isParsed'],
                ifNoneOf: ['of', 'Of']
            },
            onCamelized: {
                ifAllOf: ['isParsed'],
                ifAtLeastOneOf: ['of', 'Of']
            },
            hydrate: 'onRules'
        }
    },
    superclass: BeOverloading
});
register(ifWantsToBe, upgrade, tagName);
