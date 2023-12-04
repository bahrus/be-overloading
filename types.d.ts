import {IBE} from 'be-enhanced/types.js';
import { ActionOnEventConfigs } from "trans-render/froop/types";

export interface EndUserProps extends IBE<HTMLElement>{
    of?:  Array<OnStatement>;
    Of?: Array<OnStatement>;
}

export interface AllProps extends EndUserProps{
    isParsed?: boolean,
    onRules: Array<OnRule>
}

export interface OnRule{
    names: string[],
    triggerType?: 'Event' | 'Events' | 'PropChanges'
}

export interface WithNotFullyParsedRule extends OnRule{
    commaDelimitedNames: string,
}

export type OnStatement = string;

export type AP = AllProps;

export type PAP = Partial<AP>;

export type ProPAP = Promise<PAP>;

export type POA = [PAP | undefined, ActionOnEventConfigs<PAP, Actions>];

export interface Actions{
    onCamelized(self: this): ProPAP;
    hydrate(self: this): ProPAP;
    noAttrs(self: this): ProPAP;
}