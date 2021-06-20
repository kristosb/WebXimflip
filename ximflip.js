function degToRad(deg){
    return deg*(Math.PI/180);
}

function radToDeg(rad){
    return rad*(180/Math.PI);
}
var degtorad = Math.PI / 180;

function anglesToMatrix(heading,attitude,bank){

    //Cos and sin
    var ch = Math.cos(heading),
        sh = Math.sin(heading),
        ca = Math.cos(attitude),
        sa = Math.sin(attitude),
        cb = Math.cos(bank),
        sb = Math.sin(bank);

    const rotationMatrix = new THREE.Matrix3();
    rotationMatrix.set( 
        ch*ca , -ch*sa*cb + sh*sb , ch*sa*sb + sh*cb 
        ,sa   ,       ca*cb       ,      -ca*sb  
        ,-sh*ca , sh*sa*cb + ch*sb  , -sh*sa*sb + ch*cb 
        );
    return rotationMatrix;
}
function anglesToMatrix4(heading,attitude,bank){

    const m3 = anglesToMatrix(heading,attitude,bank);
    const rotationMatrix = new THREE.Matrix4();

    rotationMatrix.set( 
        m3.elements[0], m3.elements[1], m3.elements[2], 0
        , m3.elements[3], m3.elements[4], m3.elements[5], 0
        , m3.elements[6], m3.elements[7], m3.elements[8], 0
        ,0  ,0  ,0  ,1
        );
    return rotationMatrix;
}


function eulerAngles(heading,attitude,bank){

    var matrix = anglesToMatrix(heading,attitude,bank);

    //Singularity fix
    //http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToEuler/index.htm
    //North pole
    if( matrix[1][0]>0.998 ){
        heading = Math.atan2( -matrix[2][0], matrix[0][0] )+ Math.PI;//Math.atan2( matrix[0][2], matrix[2][2] );
        attitude = Math.asin( matrix[1][0] );//Math.PI/2;
        bank = 0;//Math.atan2( -matrix[1][2], matrix[1][1] );//0
        //console.log("s1");
    //South pole
    } else if( matrix[1][0]<-0.998 ){
        heading = Math.atan2( -matrix[2][0], matrix[0][0] )+ Math.PI;//Math.atan2( matrix[0][2], matrix[2][2] );
        attitude = -Math.PI/2;
        bank = 0;
        //console.log("s2");
    } else {
        heading = Math.atan2( -matrix[2][0], matrix[0][0] )+ Math.PI;
        attitude = Math.asin( matrix[1][0] );
        bank = Math.atan2( -matrix[1][2], matrix[1][1] );
    }

    //Turn radians back to degrees and return
    return {
        "HEADING":  radToDeg( heading ),
        "ATTITUDE": radToDeg( attitude ),
        "BANK": radToDeg( bank ),
        "MATRIX": matrix
    };
}

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
    get rotationMatrix(){
        return anglesToMatrix(this.state.xOri,this.state.zOri,this.state.yOri);
    }
    get matrix4(){
        this.updated = false;
        const rotationMatrix = new THREE.Matrix4();
        var m4 = this.state.m4;
        m4.multiply(rotationMatrix.makeRotationY(270*degtorad));
        return m4;
    }
}



