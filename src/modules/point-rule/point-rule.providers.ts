import { PointRuleViewModel, PointRuleMapListViewModel, PointRuleTempViewModel, PointRuleMapTempListViewModel } from '../../models'
import { PMSPOINTRULEVIEW_REPOSITORY, PMSPOINTRULEMAPVIEW_REPOSITORY, PMSPOINTRULETEMPVIEW_REPOSITORY, PMSPOINTRULEMAPTEMPVIEW_REPOSITORY } from '../../config/constants'

export const PointRuleProviders = [
    {
        provide: PMSPOINTRULEVIEW_REPOSITORY,
        useValue: PointRuleViewModel
    },
    {
        provide: PMSPOINTRULEMAPVIEW_REPOSITORY,
        useValue: PointRuleMapListViewModel
    },
    {
        provide: PMSPOINTRULETEMPVIEW_REPOSITORY,
        useValue: PointRuleTempViewModel
    },
    {
        provide: PMSPOINTRULEMAPTEMPVIEW_REPOSITORY,
        useValue: PointRuleMapTempListViewModel
    }
];