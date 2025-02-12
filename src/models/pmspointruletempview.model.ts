import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, HasMany } from 'sequelize-typescript';
import { PointRuleMapTempListViewModel } from './index'

@Table({ tableName: 'pmspointruletempview' })

export class PointRuleTempViewModel extends Model{

    @Column({
        type: DataType.BIGINT,
        allowNull: false,
        primaryKey : true
    })
    id: bigint;
    
    @Column({
        type: DataType.BIGINT
    })
    ref_id: bigint;

    @Column({
        type: DataType.TEXT
    })
    rule_name: string;

    @Column({
        type: DataType.BOOLEAN
    })
    is_sku_rule: boolean;

    @Column({
        type: DataType.BOOLEAN
    })
    is_global_rule: boolean;

    @Column({
        type: DataType.BOOLEAN
    })
    is_service_rule: boolean;

    @Column({
        type: DataType.BOOLEAN
    })
    is_range: boolean;

    @Column({
        type: DataType.BOOLEAN
    })
    is_active: boolean;

    @Column({
        type: DataType.INTEGER
    })
    point_expiry_interval_days: number;

    @Column({
        type: DataType.TEXT
    })
    start_date: string;

    @Column({
        type: DataType.TEXT
    })
    end_date: string;

    @Column({
        type: DataType.INTEGER
    })
    tire_id: number;

    @Column({
        type: DataType.TEXT
    })
    tier_name: string;

    @Column({
        type: DataType.BIGINT
    })
    bussiness_id: bigint;

    @Column({
        type: DataType.TEXT
    })
    businessname: string;

    @Column({
        type: DataType.TEXT
    })
    action: string;

    @Column({
        type: DataType.TEXT
    })
    created_by: string;

    @Column({
        type: DataType.SMALLINT
    })
    created_user_type: number;

    @Column({
        type: DataType.TEXT
    })
    created_at: string;

    @HasMany(() => PointRuleMapTempListViewModel)
    map_item: PointRuleMapTempListViewModel[]

}