import { Table, Column, Model, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({ tableName: 'pmsvoucher' })

export class VoucherModel extends Model{

    @Column({
        type: DataType.STRING(50),
        allowNull: false,
        unique: true,
        primaryKey : true
    })
    voucherid: string;

    @Column({
        type: DataType.BIGINT
    })
    merchantid: bigint;

    @Column({
        type: DataType.TEXT
    })
    vouchertype: string;

    @Column({
        type: DataType.DOUBLE
    })
    vouchervalue: number;

    @Column({
        type: DataType.BIGINT
    })
    productid: bigint;

    @Column({
        type: DataType.TEXT
    })
    terms: string;

    @Column({
        type: DataType.INTEGER
    })
    vouchervalidity: number;

    @Column({
        type: DataType.DOUBLE
    })
    minexpamount: number;

    @Column({
        type: DataType.TEXT
    })
    voucherimage: string;

    @Column({
        type: DataType.INTEGER
    })
    rewardpoint: number;

    @Column({
        type: DataType.TEXT
    })
    description: string;

    @Column({
        type: DataType.INTEGER
    })
    quota: number;

    @Column({
        type: DataType.INTEGER
    })
    status: number;

    @Column({
        type: DataType.TEXT
    })
    createdby: string

    @Column({
        type: DataType.DOUBLE
    })
    price: number;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    isonedit: boolean

    @Column({
        type: DataType.INTEGER
    })
    tier_id: number;

    @Column({
        type: DataType.DATEONLY
    })
    startdate: Date

    @Column({
        type: DataType.DATEONLY
    })
    expirydate: Date

    @Column({
        type: DataType.BOOLEAN
    })
    islocationwise: boolean

    @Column({
        type: DataType.DOUBLE
    })
    lat: number

    @Column({
        type: DataType.DOUBLE
    })
    long: number

    @Column({
        type: DataType.BIGINT
    })
    town: bigint

    @Column({
        type: DataType.BIGINT
    })
    country: bigint

    @Column({
        type: DataType.BOOLEAN
    })
    isglobal: boolean

    @Column({
        type: DataType.DOUBLE
    })
    distancecover: number
}