import { Controller, Param, Patch } from '@nestjs/common';

@Controller('disputes')
export class UpdateDisputeController {
  @Patch(':id')
  updateDispute(@Param('id') id: string) {
    return `Dispute ${id}`;
  }
}
