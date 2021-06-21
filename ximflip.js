var degtorad = Math.PI / 180;
var radToDeg = 180 / Math.PI;

function dataJoin(data,h,m,l){
	var res = (data.getUint8(h) & 0xFF)<<16 | (data.getUint8(m) & 0xFF)<<8 | (data.getUint8(l) & 0xFF) ;
return res;
}

class ximflip {
    constructor(){
        //var state = {};
        this.updated = false;
        this.state = {};
        var that = this;
        function handleData( event ) {

            var data = event.target.value;
        
            // http://stackoverflow.com/questions/40730809/use-daydream-controller-on-hololens-or-outside-daydream/40753551#40753551
        
            that.state.isClickDown = (data.getUint8(15) & 0x04) > 0;
            that.state.isAppDown = (data.getUint8(15) & 0x10) > 0;
            that.state.isHomeDown = (data.getUint8(15) & 0x08) > 0;
            //state.triggerDown = (data.getUint8(15) & 0x80) > 0;
            that.state.padClick= (data.getUint8(16) & 0x60) > 0;
            that.state.padHold= (data.getUint8(16) & 0x80) > 0;
        
            that.state.time = ((data.getUint8(11) & 0xFF) << 16 | (data.getUint8(12) & 0xFF) << 8| (data.getUint8(13) & 0xFF) << 0);
        
            that.state.seq = 0;//(data.getUint8(1) & 0x7C) >> 2;
        
        
            that.state.A = dataJoin(data,2,3,4);
            that.state.A =  that.state.A >>23 == 0 ? that.state.A : that.state.A|0xffE00000;
            that.state.A *= (1 / 10000);
            that.state.A -=180;
            that.state.A = -that.state.A;
            that.state.B = dataJoin(data, 5,6,7);
            //state.yoriDeg = (state.B<<8)*1.0;
            that.state.B =  that.state.B >>23 == 0 ? that.state.B : that.state.B|0xffE00000;
            //state.B=  state.B <<8;
            //state.B *= (1 / 128);
            //that.state.B *= -(1 / 10000);
            that.state.B *= (1 / 10000);
        
            that.state.C = dataJoin(data, 8,9,10);
            that.state.C =  that.state.C >>23 == 0 ? that.state.C : that.state.C|0xffE00000;
            that.state.C *= (1 / 10000);
        
        
            that.state.xOri = that.state.C * Math.PI /180;
            that.state.yOri = that.state.A * Math.PI /180;
            that.state.zOri = that.state.B * Math.PI /180;
        
            that.state.xTouch = ((data.getUint8(16) & 0x03) << 8 | (data.getUint8(17) & 0xFF) >> 0) / 1023;
            that.state.yTouch = ((data.getUint8(18) & 0x03) << 8 | (data.getUint8(19) & 0xFF) >> 0) / 1023;
        
            var baseN = 2;
        
            that.state.D0 =  data.getUint8(0).toString(baseN);
            that.state.D0 = '0b'+"00000000".substr(that.state.D0.length) + that.state.D0;
            that.state.D1 = data.getUint8(1).toString(baseN);
            that.state.D1 = '0b'+"00000000".substr(that.state.D1.length) + that.state.D1;
            that.state.D2 = data.getUint8(2).toString(baseN);
            that.state.D2 = '0b'+"00000000".substr(that.state.D2.length) + that.state.D2;
            that.state.D3 = data.getUint8(3).toString(baseN);
            that.state.D3 = '0b'+"00000000".substr(that.state.D3.length) + that.state.D3;
            that.state.D4 = data.getUint8(4).toString(baseN)
            that.state.D4 = '0b'+"00000000".substr(that.state.D4.length) + that.state.D4;
            //state.D4 = '0b'+n4;
        
            that.state.D5 = data.getUint8(5).toString(baseN);
            that.state.D5 = '0b'+"00000000".substr(that.state.D5.length) + that.state.D5;
            that.state.D6 = data.getUint8(6).toString(baseN);
            that.state.D6 = '0b'+"00000000".substr(that.state.D6.length) + that.state.D6;
            that.state.D7 = data.getUint8(7).toString(baseN);
            that.state.D7 = '0b'+"00000000".substr(that.state.D7.length) + that.state.D7;
            that.state.D8 = data.getUint8(8).toString(baseN);
            that.state.D8 = '0b'+"00000000".substr(that.state.D8.length) + that.state.D8;
            that.state.D9 = data.getUint8(9).toString(baseN);
            that.state.D9 = '0b'+"00000000".substr(that.state.D9.length) + that.state.D9;
            that.state.D10 = data.getUint8(10).toString(baseN);
            that.state.D10 = '0b'+"00000000".substr(that.state.D10.length) + that.state.D10;
            that.state.D11 = data.getUint8(11).toString(baseN);
            that.state.D11= '0b'+"00000000".substr(that.state.D11.length) + that.state.D11;
            that.state.D12 = data.getUint8(12).toString(baseN);
            that.state.D12 = '0b'+"00000000".substr(that.state.D12.length) + that.state.D12;
            that.state.D13 = data.getUint8(13).toString(baseN);
            that.state.D13 = '0b'+"00000000".substr(that.state.D13.length) + that.state.D13;
            that.state.D14 = data.getUint8(14).toString(baseN);
            that.state.D14 = '0b'+"00000000".substr(that.state.D14.length) + that.state.D14;
            that.state.D15 = data.getUint8(15).toString(baseN);
            that.state.D15 = '0b'+"00000000".substr(that.state.D15.length) + that.state.D15;
            that.state.D16 = data.getUint8(16).toString(baseN);
            that.state.D16 = '0b'+"00000000".substr(that.state.D16.length) + that.state.D16;
            that.state.D17 = data.getUint8(17).toString(baseN);
            that.state.D17 = '0b'+"00000000".substr(that.state.D17.length) + that.state.D17;
            that.state.D18 = data.getUint8(18).toString(baseN);
            that.state.D18 = '0b'+"00000000".substr(that.state.D18.length) + that.state.D18;
            that.state.D19 = data.getUint8(19).toString(baseN);
            that.state.D19 = '0b'+"00000000".substr(that.state.D19.length) + that.state.D19;
            var eulerRot = new THREE.Matrix4();
            const eulerVector = new THREE.Euler( that.state.xOri,that.state.yOri,that.state.zOri, 'YZX' );
            that.state.m4 =  eulerRot.makeRotationFromEuler(eulerVector);
            that.updated = true;
        }
        function connect() {

            return navigator.bluetooth.requestDevice( {
                filters: [ {
                    name: 'Mira Prism Remote'
                } ],
                optionalServices: [ 0xF000 ]
            } )
            .then( function ( device ) {
                return device.gatt.connect();
            } )
            .then( function ( server ) {
                return server.getPrimaryService( 0xF000 );
            } )
            .then( function ( service ) {
                return service.getCharacteristic( 0xF001 );
            } )
            .then( function ( characteristic ) {
                characteristic.addEventListener( 'characteristicvaluechanged', handleData );
                return characteristic.startNotifications();
            } )
    
        }
        connect();
    }
    get info(){
        this.updated = false;
        return this.state;
    }
    get ready(){
        return this.updated;
    }
    get matrix4(){
        this.updated = false;
        const rotationMatrix = new THREE.Matrix4();
        var m4 = this.state.m4;
        m4.multiply(rotationMatrix.makeRotationY(270*degtorad));
        return m4;
    }
    get eulerAngles(){
        /*const eulerAngles = new THREE.Euler( 0,0,0, 'YZX' );
        eulerAngles.setFromRotationMatrix(this.matrix4,'YZX' );
        const offset = new THREE.Vector3( 0, 180, 0 );
        const flip = new THREE.Vector3( -1, 1, -1 );
        //(bank,heading,altitude)
        return eulerAngles.toVector3().multiplyScalar(radToDeg).add(offset).multiply(flip);*/
        const angles = new THREE.Vector3( this.state.A, this.state.B, this.state.C );//(heading,altitude,bank)
        return angles;
    }
}



