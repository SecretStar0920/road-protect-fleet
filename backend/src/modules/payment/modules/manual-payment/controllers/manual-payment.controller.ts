import { Controller, forwardRef, Inject, UseGuards } from '@nestjs/common';
import { GetManualPaymentService } from '@modules/payment/modules/manual-payment/services/get-manual-payment.service';
import { CreateManualPaymentService } from '@modules/payment/modules/manual-payment/services/create-manual-payment.service';
import { UpdateManualPaymentService } from '@modules/payment/modules/manual-payment/services/update-manual-payment.service';
import { DeleteManualPaymentService } from '@modules/payment/modules/manual-payment/services/delete-manual-payment.service';
import { GetManualPaymentsService } from '@modules/payment/modules/manual-payment/services/get-manual-payments.service';
import { IsDefined, IsOptional } from 'class-validator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';

export class UpdateManualPaymentDto {
    // Insert Properties
}

export class CreateManualPaymentDto {
    @IsDefined()
    infringementId: number;

    @IsOptional()
    documentId?: number;

    @IsDefined()
    referenceNumber: string;

    @IsOptional()
    details?: any;

    @IsOptional()
    amountPaid?: string;
}

@Controller('manual-payment')
@UseGuards(UserAuthGuard)
@ApiBearerAuth()
export class ManualPaymentController {
    constructor(
        private getManualPaymentService: GetManualPaymentService,
        private getManualPaymentsService: GetManualPaymentsService,
        @Inject(forwardRef(() => CreateManualPaymentService))
        private createManualPaymentService: CreateManualPaymentService,
        private updateManualPaymentService: UpdateManualPaymentService,
        private deleteManualPaymentService: DeleteManualPaymentService,
    ) {}

    // @Get(':manualPaymentId')
    // async getManualPayment(@Param('manualPaymentId') manualPaymentId: number): Promise<ManualPayment> {
    //     return await this.getManualPaymentService.get(manualPaymentId);
    // }
    //
    // @Get()
    // async getManualPayments(): Promise<ManualPayment[]> {
    //     return await this.getManualPaymentsService.get();
    // }
    //
    // @Post()
    // async createManualPayment(@Body() dto: CreateManualPaymentDto): Promise<ManualPayment> {
    //     return await this.createManualPaymentService.create(dto);
    // }
    //
    // @Post(':manualPaymentId')
    // async updateManualPayment(@Param('manualPaymentId') manualPaymentId: number, @Body() dto: UpdateManualPaymentDto): Promise<ManualPayment> {
    //     return await this.updateManualPaymentService.update(manualPaymentId, dto);
    // }
    //
    // @Delete(':manualPaymentId')
    // async deleteManualPayment(@Param('manualPaymentId') manualPaymentId): Promise<ManualPayment> {
    //     return await this.deleteManualPaymentService.delete(manualPaymentId);
    // }
    //
    // @Delete(':manualPaymentId/soft')
    // async softDeleteManualPayment(@Param('manualPaymentId') manualPaymentId): Promise<ManualPayment> {
    //     return await this.deleteManualPaymentService.softDelete(manualPaymentId);
    // }
}
