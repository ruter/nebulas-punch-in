<style scoped>
    .index {
        width: 100%;
    }
    .mt-8 {
        margin-top: 8px;
    }
    .mb-32 {
        margin-bottom: 32px;
    }
    .text-right {
        text-align: right;
    }
    .text-left {
        text-align: left;
    }
</style>
<template>
    <div class="index">
        <Row type="flex" justify="center" align="middle" class="mb-32">
            <Col span="24">

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
                account: null,
                loading: true,
                interval: null,
                exCount: 0,
            }
        },
        filters: {
            dateFmt: function (stamp) {
                return util.dateFmt(stamp);
            }
        },
        created() {
            this.interval = setInterval(() => {
                if (this.exCount > 5) {
                    clearInterval(this.interval);
                    this.showError();
                }
                this.exCount++;
                this.initAccount();
            }, 1000);
        },
        methods: {
            initAccount() {
                const address = localStorage.getItem('nasAddress');
                if (address) {
                    clearInterval(this.interval);
                    this.account = Account.fromAddress(address);
                }
            },
            showError() {
                this.$Modal.warning(util.PocketErr);
            },
        }
    };
</script>