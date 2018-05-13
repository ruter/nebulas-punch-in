<style scoped>
    .index {
        width: 100%;
    }
    .card-task {
        width: 400px;
        height: 500px;
    }
    .card-header {
        height: 160px;
    }
    .card-body {
        padding: 16px 0;
    }
    .card-footer {
        position: absolute;
        width: 100%;
        margin: 8px auto;
        bottom: 8px;
        left: 0;
        right: 0;
    }
    .card-footer button {
        width: 80px !important;
        height: 80px !important;
        font-size: 24px !important;
    }
    .card-header h1 {
        line-height: 160px;
    }
    .ellip {
        text-overflow: ellipsis;
        /*display: -webkit-box;*/
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
        height: 80px;
        overflow: hidden;
    }
    .state0 {
        margin-top: 16px;
        font-size: 16px;
        color: #2d8cf0;
    }
    .state1 {
        margin-top: 8px;
        font-size: 16px;
        color: #19be6b;
    }
    .state-1 {
        margin-top: 8px;
        font-size: 16px;
        color: #ed3f14;
    }
    .task-create {
        width: 400px !important;
        height: 500px !important;
        border: 1px dashed #a6a6a6;
        font-size: 64px !important;
    }
</style>
<template>
    <div class="index">
        <Row type="flex" justify="center" align="middle">
            <Col span="6" class="mr8">
                <Card class="text-center card-task">
                    <div class="gradient-0 card-header">
                        <h1>第 1 天</h1>
                    </div>
                    <div class="card-body">
                        <h2>健身</h2>
                        <p class="ellip mt8">每天跑步 3 公里以上</p>
                        <p class="mt8">2018.05.13 ~ 2018.05.20</p>
                        <p class="state0">未打卡</p>
                    </div>
                    <div class="card-footer">
                        <Button type="ghost" shape="circle" icon="checkmark-round" size="large"></Button>
                    </div>
                </Card>
            </Col>
            <Col span="6" class="mr8">
                <Card class="text-center card-task">
                    <div class="gradient-1 card-header">
                        <h1>第 2 天</h1>
                    </div>
                    <div class="card-body">
                        <h2>读书</h2>
                        <p class="ellip mt8">认真读书 30 分钟</p>
                        <p class="mt8">2018.05.13 ~ 2018.05.20</p>
                        <p class="state1">已打卡</p>
                    </div>
                    <div class="card-footer">
                        <Button type="ghost" shape="circle" icon="checkmark-round" size="large"></Button>
                    </div>
                </Card>
            </Col>
            <Col span="6" class="mr8">
                <router-link to="/create">
                    <Button type="ghost" icon="plus-circled"
                            class="task-create" size="large"></Button>
                </router-link>
            </Col>
        </Row>
        <Spin size="large" fix v-if="loading"></Spin>
    </div>
</template>
<script>
    import util from '../libs/util';
    import NebPay from '../libs/nebpay';
    import {Account} from 'nebulas';

    let nebPay = new NebPay();

    export default {
        data() {
            return {
                tasks: [],
                account: null,
                loading: true,
                interval: null,
                exCount: 0
            }
        },
        filters: {
            dateInterval: function (dateString, cycle) {
                if (dateString) {
                    let date = typeof dateString !== 'object' ? new Date(dateString) : dateString;
                    let endDate =  new Date(date.getTime() + cycle * 86400000);
                    const start = util.dateSep(date);
                    const end = util.dateSep(endDate);
                    return `${start.year}.${start.month}.${start.day} ~ ${end.year}.${end.month}.${end.day}`;
                } else {
                    return '未知时间';
                }
            }
        },
        created() {
//            this.interval = setInterval(() => {
//                if (this.exCount > 5) {
//                    clearInterval(this.interval);
//                    this.showError();
//                }
//                this.exCount++;
//                this.initAccount();
//            }, 1000);
            this.loading = false;
        },
        methods: {
            initAccount() {
                const address = localStorage.getItem('nasAddress');
                if (address) {
                    clearInterval(this.interval);
                    this.account = Account.fromAddress(address);
                    this.getValidTasks();
                }
            },
            showError() {
                this.$Modal.warning(util.PocketErr);
            },
            getValidTasks() {
                if (!this.account) {
                    this.showError();
                    return;
                }
                let to = util.getContractAddress();
                nebPay.simulateCall(to, '0', 'getValidTasks', "[]", {
                    listener: (data) => {
                        this.tasks = util.parse(data.result);
                        this.loading = false;
                    }
                });
            }
        }
    };
</script>