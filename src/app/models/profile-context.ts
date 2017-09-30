
import { IProfileControlMasterContext } from './iprofile-control-master-context';

export class ProfileContext {
    public miniProfileControlMasterDO: IProfileControlMasterContext[];
    public list: IProfileControlMasterContext[];
    public message: string;
    public operationSuccess: boolean;
}
