import Vue from 'vue'
import Router from 'vue-router'
import Jockey from '@/view/Jockey'
import In from '@/view/In'
import Out from '@/view/Out'
import Packing from '@/view/Packing'
import AuditTable from '@/view/AuditTable'
import Stock from '@/view/Stock'
import Product from '@/view/Product'
import Scrap from '@/view/Scrap'

import Apply from '@/components/Apply'
import Restock from '@/view/Restock'
import Login from '@/view/Login'
import SemiFinishedfrom from '@/components/Semi-finished';
Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            name: 'Login',
            components: {
                Home: Login
            },
            meta: {
                index: 1
            }
        }, {
            path: '/',
            name: 'Jockey',
            components: {
                Home: Jockey
            },
            meta: {
                index: 2
            },
            children: [{
                    path: '/In',
                    // name: 'In',
                    components: {
                        Home: In
                    },

                    children: [{
                            path: 'semistock',
                            name: 'semistock',
                            component: SemiFinishedfrom,
                            meta: {
                                index: 3.1
                            }
                        },
                        {
                            path: 'restock',
                            name: 'restock',
                            component: () =>
                                import ('@/view/Restock'),
                            meta: {
                                index: 3.2
                            }
                        },
                        {
                            path: 'FinishedProIn',
                            name: 'FinishedProIn',
                            component: () =>
                                import ('@/components/FinishedProIn'),
                            meta: {
                                index: 3.3
                            }
                        }
                    ],
                    meta: {
                        index: 3
                    }
                },
                {
                    path: '/Out',
                    name: 'Out',
                    components: {
                        Home: Out
                    },
                    meta: {
                        index: 4
                    }
                },
                {
                    path: '/Packing',
                    name: 'Packing',
                    components: {
                        Home: Packing
                    },
                    meta: {
                        index: 5
                    }
                },
                {
                    path: '/AuditTable',
                    name: 'AuditTable',
                    components: {
                        Home: AuditTable
                    },
                    meta: {
                        index: 6
                    }
                }, {
                    path: '/Product',
                    name: 'Product',
                    components: {
                        Home: Product
                    },
                    meta: 　{
                        index: 7
                    }
                },
            ]
        },
        {
            path: '/Stock',
            name: 'Stock',
            components: {
                Home: Stock
            },
            meta: {
                index: 71
            }
        },
        {
            path: '/Apply',
            name: 'Apply',
            components: {
                Home: Apply
            },
            meta: {
                index: 25
            }
        },
        {
            path: '/restockapp',
            name: 'restockapp',
            components: {
                Home: () =>
                    import ('@/view/RestockApp')
            },
            meta: {
                index: 26
            }
        },
        {
            path: '/warehouse_record',
            name: '/warehouse_record',
            components: {
                Home: () =>
                    import ('@/view/WarehouseRecord')
            },
            meta: {
                index: 21
            }
        },
        {
            path: '/finished_pro_app',
            name: 'finished_pro_app',
            components: {
                Home: () =>
                    import ('@/view/FinishedProApp')
            },
            meta: {
                index: 71
            }
        },

        {
            path: '/finished_pro_stock',
            name: 'finished_pro_stock',
            components: {
                Home: () =>
                    import ('@/view/FinishedProStock')
            },
            meta: {
                index: 72
            }
        },
        {
            path: '/finishedrecord',
            name: 'finishedrecord',
            components: {
                Home: () =>
                    import ('@/view/FinishedRecord')
            },
            meta: {
                index: 73
            }
        }, {
            path: '/waitstorage', // 待入库
            name: 'waitstorage',
            components: {
                Home: () =>
                    import ('@/view/WaitStorage')
            },
            meta: {
                index: 8
            },
            children: [{
                path: 'data',
                name: 'data',
                component: () =>
                    import ('@/components/waitstorage/WaitStorageData'),
                meta: {
                    index: 81
                }
            }, {
                path: 'record',
                name: 'record',
                component: () =>
                    import ('@/components/waitstorage/WaitStorageRecord'),
                meta: {
                    index: 82
                }
            }, {
                path: 'current',
                name: 'current',
                component: () =>
                    import ('@/components/waitstorage/WaitStorageCurrent'),
                meta: {
                    index: 83
                }
            }]
        }, {
            path: '/Scrap',
            name: 'Scrap',
            components: {
                Home: Scrap
            },
            meta: {
                index: 9
            },
            children: [{
                path: 'scraprecord',
                name: 'scraprecord',
                component: () =>
                    import ('@/components/scrap/ScrapRecord'),
                meta: {
                    index: 91
                }
            }, {
                path: 'scrapdata',
                name: 'scrapdata',
                component: () =>
                    import ('@/components/scrap/ScrapData'),
                meta: {
                    index: 92
                }
            }, ]
        },
        {
            path: '/scrapapp',
            name: 'scrapapp',
            components: {
                Home: () =>
                    import ('@/components/scrap/ScrapApp'),
            },
            meta: {
                index: 93
            }
        }
    ]
})