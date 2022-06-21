<template>
    <div class="modal_blackout" @click.self="$emit('closeQR')">
        <div class="modal_window">
            <div class="modal_close" @click.self="$emit('closeQR')">Close</div>
            <img :src="qr" id="imageid" crossorigin="anonymous"/>
            <a class="myButton" @click="download()" id="dlink" style="width:auto;">Download PNG</a>
        </div>
    </div>
</template>
<script>
import { useStore } from 'vuex'

export default {
    props: ['link'],
    setup(props) {
        const store = useStore()
        const qr = store.getters.getHost()+'/ajax.php?action=get_qr_code&url='+encodeURIComponent(props.link)
        function getBase64Image(img) {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            var dataURL = canvas.toDataURL("image/png");
            return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
        }
        return {
            getBase64Image,
            qr
        }
    },
    methods: {
        download(){
            const base64 = this.getBase64Image(document.getElementById("imageid"));
            var a = document.getElementById("dlink")
            a.href = 'data:image/gif;base64,' + base64 
            a.download = "qr.png" 
        }
    },
}
</script>
<style scoped>
    .modal_blackout{
        background: #000000a3;
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 22;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .modal_window{
        display: block;
        position: relative;
        background: #fff;
        padding: 40px;
        box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.05);
        border-radius: 5px;
        z-index: 11;
    }
    .modal_close{
        position: absolute;
        right: 20px;
        top: 10px;
        cursor: pointer;
        color: #4A7589;
    }
    .modal_close:hover{
        text-decoration: underline;
    }
</style>