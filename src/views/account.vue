<style scoped>
    .index {
        width: 100%;
    }
    .pet-mb-32 {
        margin-bottom: 32px;
    }
    .pet-mb-160 {
        margin-bottom: 160px;
    }
    .pet-avatar {
        border-radius: 50%;
        width: 160px;
        height: 160px;
        padding: 8px;
    }
    .pet-mr-8 {
        margin-right: 8px;
    }
    .pet-mr-32 {
        margin-right: 32px;
    }
    .pet-pb-16 {
        padding-bottom: 16px;
    }
    .pet-pt-16 {
        padding-top: 16px;
    }
    .pet-mt-16 {
        margin-top: 16px;
    }
    .text-right {
        text-align: right;
    }
    .text-left {
        text-align: left;
    }
    p.text-right {
        margin-right: 8px;
    }
</style>
<template>
    <div class="index">
        <Tabs>
            <TabPane label="历史打卡" icon="ios-timer">
                <Row type="flex" justify="center" align="middle">
                    <Col span="20" style="text-align: center" v-if="!noData">
                        <Table :data="taskData" :columns="taskCol" stripe></Table>
                        <div style="margin: 10px;overflow: hidden">
                            <div style="float: right;">
                                <Page :total="total" :current="page" :page-size="limit"
                                      @change="handlePageChange"></Page>
                            </div>
                        </div>
                    </Col>
                    <Col span="12" style="text-align: center" v-else>
                        <div style="text-align: center">
                            <h1><img :src="require('../map.png')" alt=""></h1>
                            <h2 class="mb32">
                                你还没有任何打卡目标，快来创建一个打卡，向目标迈进吧~
                            </h2>
                            <router-link to="/create">
                                <Button type="primary" size="large" icon="planet">
                                    <span>新建打卡</span>
                                </Button>
                            </router-link>
                        </div>
                    </Col>
                </Row>
            </TabPane>
            <TabPane label="我的激励金" icon="social-usd">
                <Row type="flex" justify="center" align="middle">
                    <Col span="20" style="text-align: center">
                    <h2>
                            <span>
                                <Icon type="ios-infinite"></Icon>
                                激励金额: {{ balance }} Wei（{{ balance | nasFromBasic }} NAS）
                                可转出金额：{{ reward }} Wei（{{ reward | nasFromBasic }} NAS）
                            </span>
                        <span><Icon type="cash"></Icon>钱包地址：{{ address }}</span>
                    </h2>
                    <hr>
                    </Col>
                </Row>
                <p class="pet-mb-32" style="text-align: center;">
                    * 转出的激励金数值应大于 {{ transferLimit }} Wei（{{ transferLimit | nasFromBasic }} NAS）
                </p>
                <Row type="flex" justify="center" align="middle">
                    <Col span="8" style="text-align: center">
                    <Input v-model="transferAmount" size="large" placeholder="请输入要转出的激励金额...">
                    <span slot="prepend"><Icon type="ios-nutrition"></Icon></span>
                    <span slot="append">NAS</span>
                    </Input>
                    <p v-show="transferAmount > 0">
                        {{ transferAmount }} Wei ≈ {{ transferAmount | nasFromBasic }} NAS
                    </p>
                    <Button class="pet-mt-16" type="primary" size="large" @click="handleTransferClick">转出</Button>
                    </Col>
                </Row>
            </TabPane>
        </Tabs>
        <Spin size="large" fix v-if="loading"></Spin>
    </div>
</template>
<script>
    import util from '../libs/util';
    import NebPay from '../libs/nebpay';
    import {Account, Unit} from 'nebulas';
    import BigNumber from 'bignumber.js';
    var nebPay = new NebPay();

    export default {
        data() {
            return {
                page: 1,
                total: 0,
                limit: 10,
                taskCol: [
                    {
                        title: 'ID',
                        key: 'hash',
                        render: (h, params) => {
                            return h('router-link', {
                                props: { to: `/detail/${params.row.hash}` }
                            }, params.row.hash)
                        }
                    },
                    {
                        title: '目标',
                        key: 'name'
                    },
                    {
                        title: '创建时间',
                        key: 'datetime',
                        width: 200,
                        render: (h, params) => {
                            return h('div', util.dateFmt(params.row.datetime));
                        }
                    },
                    {
                        title: '激励金',
                        key: 'deposit',
                        width: 400,
                        render: (h, params) => {
                            const deposit = params.row.deposit;
                            const depositNas = Unit.fromBasic(deposit);
                            return h('div', `${deposit} Wei（${depositNas}NAS）`);
                        }
                    },
                    {
                        title: '打卡时长',
                        key: 'cycle',
                        width: 100,
                        render: (h, params) => {
                            return h('div', `${params.row.cycle} 天`)
                        }
                    },
                    {
                        title: '当前进度',
                        key: 'days',
                        width: 100,
                        render: (h, params) => {
                            return h('div', `${params.row.days} 天`)
                        }
                    },
                    {
                        title: '目标状态',
                        key: 'state',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('p', {
                                'class': {
                                    state0: params.row.state === 0,
                                    state1: params.row.state === 1,
                                    'state-1': params.row.state === -1
                                },
                                style: { 'margin-top': 0 }
                            }, this.state[params.row.state]);
                        }
                    }
                ],
                taskData: [],
                state: {
                    '-1': '已失败',
                    '0': '进行中',
                    '1': '已完成'
                },
                address: '',
                loading: true,
                timeoutObj: null,
                noData: false,
                rewardValue: '',
                balance: '',
                reward: '',
                transferLimit: '',
                transferAmount: ''
            }
        },
        filters: {
            dateFmt: function (dateString) {
                if (dateString) {
                    let date = typeof dateString !== 'object' ? new Date(dateString) : dateString;
                    const tmpDate = {
                        year: date.getFullYear(),
                        month: (date.getMonth() < 9) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
                        day: (date.getDate() < 10) ? '0' + date.getDate() : date.getDate(),
                        hour: (date.getHours() < 10) ? '0' + date.getHours() : date.getHours(),
                        min: (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes(),
                        sec: (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds()
                    };
                    return `${tmpDate.year}年${tmpDate.month}月${tmpDate.day}日`;
                } else {
                    return '未知';
                }
            },
            nasFromBasic: function (value) {
                if (value) {
                    return Unit.fromBasic(value);
                }
                return 0;
            }
        },
        watch: {
            address() {
                this.startApp();
            }
        },
        created() {
            if (util.noWallet) {
                this.loading = false;
                this.showError();
            } else {
                this.timeoutObj = setTimeout(() => {
                    this.loading = false;
                    this.showWarning();
                }, 5000);
                util.getAccount(this);
            }
        },
        methods: {
            startApp() {
                clearTimeout(this.timeoutObj);
                this.getTasksByOwner();
                this.getUserReward();
                this.getTransferLimit();
            },
            showError() {
                this.$Modal.warning(util.PocketErr);
            },
            showWarning() {
                this.$Modal.warning(util.WalletWarning);
            },
            setTransferTime() {
                localStorage.setItem('nasTransfer', Date.now());
            },
            getTransferOk() {
                let now = Date.now();
                let transferTime = localStorage.getItem('nasTransfer');
                if (!transferTime) {
                    return true;
                }
                const delta = now - transferTime;
                if (delta >= 1800000) {
                    localStorage.removeItem('nasTransfer');
                    return true;
                }
                return false;
            },
            getTasksByOwner() {
                let to = util.getContractAddress(),
                    args = util.toSting([this.page, this.limit]);
                nebPay.simulateCall(to, '0', 'getTasksByOwner', args, {
                    listener: (data) => {
                        if (data.execute_err) {
                            if (data.execute_err == 'contract check failed') {
                                this.$Modal.error({
                                    title: '网络错误',
                                    content: '请确认钱包插件网络为「Mainnet」，切换后刷新重试'
                                })
                            }
                            this.noData = true;
                        } else {
                            const res = util.parse(data.result);
                            if (res && res.tasks.length) {
                                this.taskData = res.tasks;
                                this.total = res.total;
                                this.limit = res.limit;
                            } else {
                                this.noData = true;
                            }
                        }
                        this.loading = false;
                    }
                });
            },
            getTransferLimit() {
                let to = util.getContractAddress();
                nebPay.simulateCall(to, '0', 'getTransferLimit', "[]", {
                    listener: (data) => {
                        this.transferLimit = util.parse(data.result);
                    }
                });
            },
            getUserReward() {
                let to = util.getContractAddress();
                nebPay.simulateCall(to, '0', 'getBalance', "[]", {
                    listener: (data) => {
                        let deposit = util.parse(data.result);
                        this.balance = deposit.balance;
                        this.reward = deposit.reward;
                    }
                });
            },
            handlePageChange(page) {
                this.loading = true;
                this.page = page;
                this.getTasksByOwner();
            },
            handleTransferClick() {
                if (!this.getTransferOk()) {
                    this.$Modal.error({
                        title: '无法转出',
                        content: '激励金的转出时间间隔不能小于 30 分钟'
                    });
                    return;
                }
                let to = util.getContractAddress(),
                    value = this.transferAmount,
                    basicValue = Unit.toBasic(value),
                    limit = this.transferLimit,
                    userReward = this.reward,
                    args = util.toSting([basicValue]);
                if (!(value && basicValue.gt(limit))) {
                    this.$Modal.warning({
                        title: '数额错误',
                        content: `转出数额必须大于 ${limit} Wei（${Unit.fromBasic(limit)} NAS）`
                    });
                    return;
                }
                if (basicValue.gt(userReward)) {
                    this.$Modal.error({
                        title: '数额错误',
                        content: `转出数额不能大于可转出金额 ${userReward} Wei（${Unit.fromBasic(userReward)} NAS）`
                    });
                    return;
                }
                this.loading = true;
                nebPay.call(to, "0", 'transfer', args, {
                    listener: (data) => {
                        if (!data.execute_err) {
                            this.setTransferTime();
                            let deposit = util.parse(data.result);
                            this.balance = deposit.balance;
                            this.reward = deposit.reward;
                            this.$Modal.success({
                                title: '转出成功',
                                content: '代币已转出，请稍候查看钱包交易记录'
                            });
                        } else {
                            this.$Modal.error({
                                title: '转出失败',
                                content: '余额不足，无法转出'
                            });
                        }
                        this.loading = false;
                    }
                });
            }
        }
    };
</script>