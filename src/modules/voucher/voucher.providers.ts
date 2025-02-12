import { VoucherModel, VoucherTempModel, VoucherHistoryModel } from '../../models'
import { VOUCHER_REPOSITORY, VOUCHERHISTORY_REPOSITORY, VOUCHERTEMP_REPOSITORY } from '../../config/constants'

export const VoucherProviders = [
    {
        provide: VOUCHER_REPOSITORY,
        useValue: VoucherModel
    },
    {
        provide: VOUCHERHISTORY_REPOSITORY,
        useValue: VoucherHistoryModel
    },
    {
        provide: VOUCHERTEMP_REPOSITORY,
        useValue: VoucherTempModel
    }
];