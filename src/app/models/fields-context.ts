import { IFieldContext } from './interfaces/ifield-context';
import { IMetaDatatypeTrend } from './interfaces/imetadatatypetrend';

export class FieldsContext {
    public fieldContextList: IFieldContext[];
    public fieldToProfileList: IFieldContext[];
    public allFields: IFieldContext[];
    public keyFields: IFieldContext[];
    public uniqueIdentifierFields: IFieldContext[];
    public businessName: string;
    public profileNum: string;
    public metaDatatypes: IMetaDatatypeTrend[];
    public message: string;
    public operationSuccess: boolean;
}
