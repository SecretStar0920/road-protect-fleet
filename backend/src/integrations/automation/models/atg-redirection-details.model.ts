/* tslint:disable:variable-name */
import { Config } from '@config/config';
import { IsIn, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { v4 } from 'uuid';
import * as moment from 'moment';
import * as crypto from 'crypto';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

export class ATGDocument {
    /**
     * 1 - Power of attorney
     * 2 - Leasing document / rRedirection contract
     * 3 - Infringement details document
     * 4 - Valid driver license
     */
    @IsIn(['1', '2', '3', '4'])
    DocType: '1' | '2' | '3' | '4';
    @IsString()
    EncodedFile: string;
    @IsString()
    FileName: string;

    constructor(obj: any = {}) {
        this.DocType = obj.DocType;
        this.EncodedFile = obj.EncodedFile;

        if (!obj.FileName) {
            const salt = crypto.randomBytes(3).toString('hex');
            if (this.DocType === '1') {
                this.FileName = `pa-${salt}.pdf`;
            } else if (this.DocType === '2') {
                this.FileName = `lease-${salt}.pdf`;
            } else if (this.DocType === `3`) {
                this.FileName = `infringement-${salt}.pdf`;
            } else if (this.DocType === `4`) {
                this.FileName = `drivers-license-${salt}.pdf`;
            } else {
                throw new Error(ERROR_CODES.E129_ATGUnhandledDocumentFilename.message());
            }
        } else {
            this.FileName = obj.FileName;
        }
    }
}

class ATGRedirectionImot {
    @IsString()
    MisparRechev: string; // Vehicle number
    @IsString()
    MisparZehut: string = '0'; // DO NOT CHANGE - same for every request
    @IsString()
    ShatAvera: string = '0'; // DO NOT CHANGE - same for every request
    @IsString()
    SugDoch: string = '0'; // DO NOT CHANGE - same for every request
    @IsString()
    TarichAvera: string = '0'; // DO NOT CHANGE - same for every request

    constructor(obj: any = {}) {
        this.MisparRechev = obj.MisparRechev;
    }
}

export class ATGRedirectionRequest {
    @IsString()
    Asmachta: string; // Free number that we can send (Maybe the BRN Id who is doing the nomination on our system (till 12 chars)
    @IsString()
    Dbid: string = '1'; // DO NOT CHANGE - same for every request
    @IsString()
    Debug: string = '1'; // DO NOT CHANGE - same for every request
    @IsString()
    Heara: string; // Free text (till 60 chars)
    @IsString()
    Ila: string = '0'; // DO NOT CHANGE - same for every request
    @IsString()
    KodIdkun: string = '2651'; // DO NOT CHANGE - same for every request
    @IsString()
    KodShichrurNeila: string = '0'; // DO NOT CHANGE - same for every request
    @IsString()
    MishtameshMGA: string = '0'; // DO NOT CHANGE - same for every request
    @IsString()
    MisparDoch: string; // Infringement Number
    @IsString()
    Nose: string = '246'; // DO NOT CHANGE - same for every request
    @IsString()
    SibatHazara: string = '0'; // DO NOT CHANGE - same for every request
    @IsString()
    SugTofes: string = '0'; // DO NOT CHANGE - same for every request
    @IsString()
    TaarichMazav: string; // Current Date
    @IsString()
    Tovea: string = '0'; // DO NOT CHANGE - same for every request (Maybe will be changed)
    @IsString()
    TzTovea: string = '0'; // DO NOT CHANGE - same for every request (Maybe will be changed)
    @ValidateNested()
    @Type(() => ATGRedirectionImot)
    ImotData: ATGRedirectionImot;
    @IsString()
    Bait: string; // House number (or the PO box number)
    @IsString()
    Dira: string; // Apartment number
    @IsString()
    Mahut: '0' | '1' = '1'; // DO NOT CHANGE - same for every request
    @IsString()
    Mikud: string; // Postal code
    @IsString()
    Mishpaha: string; // Family name Mahut =1 => Send name of the company (Up to 25 chars)
    @IsString()
    Prati: string; // Given name Mahut =1 => Leave field empty
    @IsString()
    Rechov: string; // Street ( If it's a PO box then write ת.ד.)
    @IsString()
    SemelRechov: string; // Street code (If we have PO box then this number is 0)
    @IsString()
    SemelYeshuv: string; // City code (RP one)
    @IsString()
    Yeshuv: string; // City name
    @IsString()
    Zehut: string; // ID number (or BRN)
    @IsString()
    Makor: string = '17'; // DO NOT CHANGE - same for every request (Maybe will be changed)
    @ValidateNested({ each: true })
    @Type(() => ATGDocument)
    Documents: ATGDocument[];

    constructor(obj: any = {}) {
        this.Asmachta = obj.Asmachta;
        this.Heara = obj.Heara;
        this.MisparDoch = obj.MisparDoch;
        this.TaarichMazav = obj.TaarichMazav || moment().format('YYYYMMDD');
        this.ImotData = new ATGRedirectionImot(obj.ImotData);
        this.Bait = obj.Bait || '';
        this.Dira = obj.Dira;
        this.Mahut = obj.Mahut || 1;
        this.Mikud = obj.Mikud || '';
        this.Mishpaha = obj.Mishpaha;
        this.Prati = obj.Prati || '';
        this.Rechov = obj.Rechov;
        this.SemelRechov = obj.SemelRechov;
        this.SemelYeshuv = obj.SemelYeshuv;
        this.Yeshuv = obj.Yeshuv;
        this.Zehut = obj.Zehut;
        this.Documents = (obj.Documents || []).map((doc) => new ATGDocument(doc));
    }
}

export class ATGRedirectionSystemHeader {
    @IsNumber()
    Customer: number; // Municipality ID
    @IsNumber()
    Recipient: number = Config.get.automation.recipient;
    @IsNumber()
    Sender: number = Config.get.automation.sender;
    @IsString()
    Token: string = '1';
    @IsString()
    TranID: string = v4(); // Unique ID - we can send them a unique id for each transaction that we send
    @IsString()
    UserId: string = Config.get.automation.userId; // RP ID (BRN)
    @IsString()
    UserPass: string = Config.get.automation.password;
    @IsString()
    Version: string = Config.get.automation.version;

    constructor(obj: any = {}) {
        this.Customer = obj.Customer;
    }
}

// See https://docs.google.com/spreadsheets/d/1KvGOeT83S73FlG8zlg6CzfBgss635EZDveg4t4S9Bf0/edit#gid=0
export class ATGRedirectionDetails {
    @ValidateNested()
    @Type(() => ATGRedirectionSystemHeader)
    systemHeader: ATGRedirectionSystemHeader;
    @ValidateNested()
    @Type(() => ATGRedirectionRequest)
    appData: ATGRedirectionRequest;

    constructor(obj: any = {}) {
        this.systemHeader = new ATGRedirectionSystemHeader(obj.systemHeader);
        this.appData = new ATGRedirectionRequest(obj.appData);
    }
}
