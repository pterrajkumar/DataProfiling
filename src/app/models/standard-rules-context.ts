import { IStandardRulesContext } from './interfaces/istandard-rules-context';


export class StandardRulesContext{
    public standardRulesList: IStandardRulesContext[];
    public positiveStandardRulesList: IStandardRulesContext[];
    public negationStandardRulesList: IStandardRulesContext[];
    public BusinessObjectName: string;
    public profileNum: string;
    public message: string;
    public operationSuccess: boolean;
}
