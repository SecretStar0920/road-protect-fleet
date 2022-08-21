import { AccountModule } from '@modules/account/account.module';
import { OwnershipContractModule } from '@modules/contract/modules/ownership-contract/ownership-contract.module';
import { LeaseContractModule } from '@modules/contract/modules/lease-contract/lease-contract.module';
import { ContractModule } from '@modules/contract/contract.module';
import { VehicleModule } from '@modules/vehicle/vehicle.module';
import { DocumentModule } from '@modules/document/document.module';
import { InfringementModule } from '@modules/infringement/infringement.module';
import { NominationModule } from '@modules/nomination/nomination.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { TaavuraModule } from '@modules/partners/modules/taavura/taavura.module';

// tslint:disable-next-line:variable-name
export const ApiModules = [
    AccountModule,
    OwnershipContractModule,
    LeaseContractModule,
    ContractModule,
    VehicleModule,
    DocumentModule,
    InfringementModule,
    NominationModule,
];

export const swaggerDocumentationDescription = `
<p>This Web API is a REST API</p>
<h3>Authentication</h3>
<p>To authenticate this swagger document please enter your token by clicking the Authorize button on the bottom right</p>
<p>To authenticate your client integration please put your token in the <strong style="text-decoration: underline">header</strong> of your requests with the key <code>Authorization</code>, it should look like this:</p>
<p><code>Authorization: Bearer YOUR_TOKEN_HERE</code></p>
<p>Please keep your token secured. If your token is compromised, we can issue a new token for you.</p>
<h3>Formats & Dates</h3>
<p>
    Please use ISO standard dates for working with the API. This is an internationally accepted format that provides the least date parsing errors in our system
<ul>
    <li>
        Documentation on the format: <a href="https://www.w3.org/TR/NOTE-datetime">https://www.w3.org/TR/NOTE-datetime</a>
    </li>
    <li>
        Example: YYYY-MM-DDThh:mm:ssTZD (eg 1997-07-16T19:20:30+01:00)
    </li>
</ul>
</p>
<p>In some cases, such as in queries, simpler YYYY-MM-DD formats are sufficient</p>
<ul><li>Example: YYYY-MM-DD (1997-07-16)</li></ul>
<h3>Additional information</h3>
<p>
    You can generate client code for all the common languages by using:
    <a href="https://editor.swagger.io/">https://editor.swagger.io/</a>
    <ol>
    <li>Download our OpenApi JSON: <a href="https://fleet.roadprotect.co.il/api/v1/documentation-json">JSON</a> (right click and save as)</li>
    <li>Go to <a href="https://editor.swagger.io/">https://editor.swagger.io/</a></li>
    <li>Import the JSON file from step 1</li>
    <li>Click Generate Client on the top menu and select your language</li>
</ol>
</p>
<h3>Contact Us</h3>
<p>Contact:<a href="mailto:support@roadprotect.co.il" rel="noopener noreferrer" class="link">Kerren</a> [English Only]</p>
<p>Contact:<a href="mailto:support@roadprotect.co.il" rel="noopener noreferrer" class="link">Ore</a> [Hebrew / English]</p>
`;

export async function InitialiseSwagger(app: INestApplication) {
    const standardOptions = new DocumentBuilder()
        .setTitle('Road Protect API')
        .setVersion('1.4.1')
        .addTag('Documents & Files')
        .addTag('Nominations')
        .addTag('Accounts')
        .addTag('Vehicles')
        .addTag('Contracts')
        .addTag('Infringements')
        .addTag('Lease Contracts')
        .addTag('Ownership Contracts')
        .addBearerAuth()
        .build();

    const standardDocument = SwaggerModule.createDocument(app, standardOptions, {
        include: ApiModules,
    });
    SwaggerModule.setup('api/v1/documentation', app, standardDocument);

    const taavuraDocument = SwaggerModule.createDocument(app, standardOptions, {
        include: [TaavuraModule, ...ApiModules],
    });
    SwaggerModule.setup('api/v1/documentation-taavura', app, taavuraDocument);

    const adminDocument = SwaggerModule.createDocument(app, standardOptions);
    SwaggerModule.setup('api/v1/documentation-admin', app, adminDocument);
}
