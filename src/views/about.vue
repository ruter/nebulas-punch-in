<style scoped>
    .index {
        width: 100%;
    }
</style>
<template>
    <div class="index">
        <Row type="flex" justify="center" align="middle">
            <Col span="20">
            <div class="mb32">
                <h1>关于「星云打卡」</h1>
                <h3>星云打卡是基于星云 3.0 公链打造的一款致力于培养用户养成打卡习惯的自我管理应用。</h3>
                <h3>在星云打卡中用户至多可以同时进行 3 个打卡目标，每一个目标都有三个可选的打卡时长，分别是 7 天，15 天和 30 天。</h3>
                <h3>每一个打卡目标都可以选择性地存入激励金用于激励自我坚持完成打卡，如果目标失败则无法取回相应的激励金。</h3>
            </div>
            <div>
                <h1>FAQ</h1>
                <Collapse value="1">
                    <Panel name="1">
                        什么是激励金？
                        <p slot="content">
                            激励金是用户在创建打卡目标的时候转入星云打卡合约中的 NAS 代币，目的在于激励用户坚持每天完成打卡，当打卡次数达到打卡目标创建时所设定的时长后，激励金将会全额返回到用户的账户。
                        </p>
                    </Panel>
                    <Panel name="2">
                        转出激励金需要收取手续费吗？
                        <p slot="content">
                            为了激励用户养成良好的打卡习惯，激励金的转出将免收手续费，但是需累积到一定数额时才能转出，目前这个额度为 0.001 NAS.
                        </p>
                    </Panel>
                    <Panel name="3">
                        为什么我只能创建三个打卡目标？
                        <p slot="content">
                            每个人的精力总是有限的，不管做什么事情都应该专注于其中将它做到最好，能够长期坚持下来的事情总是少数的。打卡目标上限为三个是为了想要让用户专注于实现更加重要且明确的目标，而不是为了自我满足而在一堆目标中打卡去获取成就感。
                        </p>
                    </Panel>
                    <Panel name="4">
                        没有完成的打卡目标会怎么样？
                        <p slot="content">
                            如果打卡目标没有完成，对应的目标将会从「我的打卡」中自动消失，而你转入到对应目标中的激励金（如果有的话）将会从你的激励金账户中扣除，意味着你未能达成目标的同时，会失去该目标的激励金。
                        </p>
                    </Panel>
                    <Panel name="5">
                        我已经完成的打卡目标为什么不见了？
                        <p slot="content">
                            已经完成的打卡目标和失败的目标会自动从「我的打卡」中消失，你可以在「个人中心」——「历史打卡」中找到相关的记录。
                        </p>
                    </Panel>
                </Collapse>
            </div>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        data() {
            return {

            };
        },
        created() {

        },
        mounted() {

        },
        beforeDestroy() {

        },
        methods: {

        }
    };
</script>
