import {IBE} from 'be-enhanced/types.js';
import { ActionOnEventConfigs } from "trans-render/froop/types";

export interface EndUserProps extends IBE{
    with?:  Array<WithStatement>;
    With?: Array<WithStatement>;
}

export interface AllProps extends EndUserProps{
    isParsed?: boolean,
    withRules: Array<WithRule>
}

export interface WithRule{
    names: string[]
}

export interface WithUnParsedRule{
    commaDelimitedNames: string,
}

export type WithStatement = string;

export type AP = AllProps;

export type PAP = Partial<AP>;

export type ProPAP = Promise<PAP>;

export type POA = [PAP | undefined, ActionOnEventConfigs<PAP, Actions>];

export interface Actions{
    onCamelized(self: this): ProPAP;
    hydrate(self: this): ProPAP;
}