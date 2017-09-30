import { IRuleControlMasterContext} from './irule-control-master-context';
import { IRulesTrendContext } from './i-rules-trend-context';

export class RuleContext {
    public ruleControlMaster: IRuleControlMasterContext[];
    public rulesTrendListDO: IRulesTrendContext[];
    public message: string;
    public operationSuccess: boolean;
}
