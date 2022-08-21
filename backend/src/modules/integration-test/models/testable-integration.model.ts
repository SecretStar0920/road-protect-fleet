export abstract class TestableIntegration {
    abstract async runTest(dto: any);
    abstract getBody(dto: any);
}

export class TestableIntegrationDto {
    // This is a class that's shared by testable integration dtos
}
