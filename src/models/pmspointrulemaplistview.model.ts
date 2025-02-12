import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, ForeignKey } from 'sequelize-typescript';
import { PointRuleViewModel } from './index'

@Table({ tableName: 'pmspointrulemaplistview' })

export class PointRuleMapListViewModel extends Model{

    @Column({
        type: DataType.BIGINT,
        allowNull: false,
        primaryKey : true
    })
    map_id: bigint;

    @ForeignKey(() => PointRuleViewModel)
    @Column({
        type: DataType.BIGINT
    })
    rule_id: bigint;

    @Column({
        type: DataType.BIGINT
    })
    product_id: bigint;
    
    @Column({
        type: DataType.TEXT
    })
    service_id: string;

    @Column({
        type: DataType.DOUBLE
    })
    start_range: number;

    @Column({
        type: DataType.DOUBLE
    })
    end_range: number;

    @Column({
        type: DataType.TEXT
    })
    point_receiver_type: string;

    @Column({
        type: DataType.INTEGER
    })
    sender_reward_point: number;

    @Column({
        type: DataType.INTEGER
    })
    receiver_reward_point: number;

    @Column({
        type: DataType.TEXT
    })
    productname: string;

    @Column({
        type: DataType.TEXT
    })
    productimage: string;

    @Column({
        type: DataType.TEXT
    })
    productdetails: string;

    @Column({
        type: DataType.TEXT
    })
    service_keyword: string;
}