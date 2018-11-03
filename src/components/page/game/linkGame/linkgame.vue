<template>
    <div>
        <!-- <table border="1" cellpadding="0" cellspacing="0" style="width: 600px; height: 400px; margin: auto;"> -->
        <table border="1" cellpadding="0" cellspacing="0" style="margin: auto;">
            <tr style="width: 100%;">
                <td style="width: 50%;">
                    连连看
                </td>
                <td style="width: 50%;">
                    <input id='btnNewGame' name="btnNewGame" type="button" value="新游戏" onclick="btnNewGame_Click()" />
                </td>
            </tr>
            <tr style="width: 100%;">
                <td style="width: 50%;">
                    棋盘大小
                </td>
                <td style="width: 50%;">
                    <!-- <select id="boardsize" style="width: 200px;"> -->
                    <select id="boardsize">
                        <option value="1">小</option>
                        <option value="2" selected="selected">中</option>
                        <option value="3">大</option>
                    </select>
                </td>
            </tr>
            <tr style="width: 100%;">
                <td style="width: 50%;">
                    操作
                </td>
                <td style="width: 50%;">
                    <input id='btnHint' name="btnHint" type="button" value='提示' onclick="btnHint_Click()" />
                    &nbsp;&nbsp;
                    <input id='btnOrder' name="btnOrder" type="button" value='暂停查看排名' onclick="btnOrder_Click()" />
                    &nbsp;&nbsp;
                    <input id='btnRemoveOrder' name="btnRemoveOrder" type="button" value='清除排名' onclick="btnRemoveOrder_Click()" />
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <canvas id="canvas">
                        <span style="background-color:Aqua;">你的浏览器不支持Html5，请用Chrome、Opera、Firefox、Safari或IE9</span>
                    </canvas>
                </td>
            </tr>
        </table>
    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    activated(){
        
    }
}
</script>
<style scoped>

</style>
