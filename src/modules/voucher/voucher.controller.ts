import {
  Controller,
  UseGuards,
  Request,
  Get,
  Query,
  Post,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../middleware/guards/JwtAuthGuard';
import { VoucherService } from './voucher.service';
import {
  VoucherDto,
  VoucherDetailsDto,
  VoucherCreateDto,
  VoucherUpdateDto,
  VoucherActionDto,
} from '../../dto';
import { getUserType } from '../../helpers/utils';

@Controller('voucher')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  /*
     For admin user we will get id, username,roleid
     For merchent parent user / bussiness user we will get id, isparentcustomer = true, mobile
         For merchent sub-user / bussiness sub-user we will get id, isparentcustomer = false, mobile, subusermobileno  // here mobile = bussiness / parent user mobile

    If admin user create a action like CREATE, UPDATE, DELETE then only admin user only can be able to approve or reject it
    IF merchent/bussiness user create a action like CREATE, UPDATE, DELETE then only merchent/bussiness user only can be able to approve or reject it.
    */

  @Get('v1/is_system_voucher')
  async systemVoucherList(@Request() req, @Query() query) {
    // const { created_user_type, created_by} = getUserType(req.user)
    // const merchantid = +(query['merchantid'] || 0)
    return await this.voucherService.systemVoucherList();
  }

  @UseGuards(JwtAuthGuard)
  @Get('v1/list')
  async voucherList(@Request() req, @Query() query) {
    const { created_user_type, created_by } = getUserType(req.user);
    const merchantid = +(query['merchantid'] || 0);
    return await this.voucherService.voucherList({
      merchantid,
      created_by,
      created_user_type,
    });
  }

  /*
    search only by voucher id
    Response {
        "voucherid": "PD00205",
        "merchantid": "1677495583539",
        "businessname": "Pilot",
        "vouchertype": "product",
        "vouchervalue": 3,
        "productid": "1677507833890",
        "productname": "Potato Regular",
        "terms": "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
        "vouchervalidity": 10,
        "minexpamount": null,
        "voucherimage": "http://3.18.0.201:9000/akash/Cash-Kolapata-1.png",
        "rewardpoint": 15,
        "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
        "quota": 999,
        "price": 15,
        "tier_name": "Not a start",
        "startdate": "2023-03-29",
        "expirydate": "2024-03-28"
    }
    */
  //   @UseGuards(JwtAuthGuard)
  @Get('v1/details')
  async voucherDetails(@Request() req, @Query() query: VoucherDetailsDto) {
    const voucherid = query['voucherid'];
    return await this.voucherService.voucherDetails({ voucherid });
  }

  @UseGuards(JwtAuthGuard)
  @Get('v1/tempdetails')
  async voucherTempDetails(@Request() req, @Query() query: VoucherDetailsDto) {
    const voucherid = query['voucherid'];
    return await this.voucherService.voucherTempDetails({ voucherid });
  }

  @UseGuards(JwtAuthGuard)
  @Post('v1/create')
  async createVoucher(@Request() req, @Body() body: VoucherCreateDto) {
    const { created_user_type, created_by } = getUserType(req.user);

    return await this.voucherService.createVoucher({
      ...body,
      created_by,
      created_user_type,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('v1/update')
  async updateVoucher(@Request() req, @Body() body: VoucherUpdateDto) {
    const { created_user_type, created_by } = getUserType(req.user);

    return await this.voucherService.updateVoucher({
      ...body,
      created_by,
      created_user_type,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('v1/delete')
  async deleteVoucher(@Request() req, @Body() body: VoucherDetailsDto) {
    const { created_user_type, created_by } = getUserType(req.user);

    return await this.voucherService.deleteVoucher({
      ...body,
      created_by,
      created_user_type,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('v1/action')
  async voucherAction(@Request() req, @Body() body: VoucherActionDto) {
    const { created_user_type, created_by } = getUserType(req.user);

    return await this.voucherService.voucherAction({
      ...body,
      created_by,
      created_user_type,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('v1/vouchercodesrelease')
  async unusedVoucherCodesRelease(@Query() query: VoucherDetailsDto) {
    const voucherid = query['voucherid'];

    return await this.voucherService.unusedVoucherCodesRelease(voucherid);
  }

  @UseGuards(JwtAuthGuard)
  @Get('v1/vouchercodesreuse')
  async unusedVoucherCodesReuse(@Query() query: VoucherDetailsDto) {
    const voucherid = query['voucherid'];
    return await this.voucherService.unusedVoucherCodesReuse(voucherid);
  }

  @UseGuards(JwtAuthGuard)
  @Get('v1/voucherReport')
  async voucherReport(@Request() req) {
    return await this.voucherService.voucherReport();
  }

  @UseGuards(JwtAuthGuard)
  @Get('v1/voucherPurchaseReport')
  async voucherPurchaseReport(
    @Request() req,
    @Query() query: VoucherDetailsDto,
  ) {
    const voucherid = query['voucherid'];
    return await this.voucherService.voucherPurchaseReport(voucherid);
  }
}
