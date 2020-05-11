// serial number X3C10100101400HC18

function DaydreamController() {

	var state = {};

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
function dataJoin(data,h,m,l){
	var res = (data.getUint8(h) & 0xFF)<<16 | (data.getUint8(m) & 0xFF)<<8 | (data.getUint8(l) & 0xFF) ;
return res;
}
	function handleData( event ) {

		var data = event.target.value;

		// http://stackoverflow.com/questions/40730809/use-daydream-controller-on-hololens-or-outside-daydream/40753551#40753551

		state.isClickDown = (data.getUint8(15) & 0x04) > 0;
		state.isAppDown = (data.getUint8(15) & 0x10) > 0;
		state.isHomeDown = (data.getUint8(15) & 0x08) > 0;
		//state.triggerDown = (data.getUint8(15) & 0x80) > 0;
		state.padClick= (data.getUint8(16) & 0x60) > 0;
		state.padHold= (data.getUint8(16) & 0x80) > 0;

		state.time = ((data.getUint8(11) & 0xFF) << 16 | (data.getUint8(12) & 0xFF) << 8| (data.getUint8(13) & 0xFF) << 0);

		state.seq = 0;//(data.getUint8(1) & 0x7C) >> 2;
	

		state.A = dataJoin(data,2,3,4);
		state.A =  state.A >>23 == 0 ? state.A : state.A|0xffE00000;
		state.A *= (1 / 10000);

		state.B = dataJoin(data, 5,6,7);
		//state.yoriDeg = (state.B<<8)*1.0;
		state.B =  state.B >>23 == 0 ? state.B : state.B|0xffE00000;
		//state.B=  state.B <<8;
		//state.B *= (1 / 128);
		state.B *= -(1 / 10000);

		state.C = dataJoin(data, 8,9,10);
		state.C =  state.C >>23 == 0 ? state.C : state.C|0xffE00000;
		state.C *= (1 / 10000);


		state.xOri = state.C * Math.PI /180;
		state.yOri = state.A * Math.PI /180;
		state.zOri = state.B * Math.PI /180;

		state.xTouch = ((data.getUint8(16) & 0x03) << 8 | (data.getUint8(17) & 0xFF) >> 0) / 1023;
		state.yTouch = ((data.getUint8(18) & 0x03) << 8 | (data.getUint8(19) & 0xFF) >> 0) / 1023;

		var baseN = 2;

		state.D0 =  data.getUint8(0).toString(baseN);
		state.D0 = '0b'+"00000000".substr(state.D0.length) + state.D0;
		state.D1 = data.getUint8(1).toString(baseN);
		state.D1 = '0b'+"00000000".substr(state.D1.length) + state.D1;
		state.D2 = data.getUint8(2).toString(baseN);
		state.D2 = '0b'+"00000000".substr(state.D2.length) + state.D2;
		state.D3 = data.getUint8(3).toString(baseN);
		state.D3 = '0b'+"00000000".substr(state.D3.length) + state.D3;
		state.D4 = data.getUint8(4).toString(baseN)
		state.D4 = '0b'+"00000000".substr(state.D4.length) + state.D4;
		//state.D4 = '0b'+n4;

		state.D5 = data.getUint8(5).toString(baseN);
		state.D5 = '0b'+"00000000".substr(state.D5.length) + state.D5;
		state.D6 = data.getUint8(6).toString(baseN);
		state.D6 = '0b'+"00000000".substr(state.D6.length) + state.D6;
		state.D7 = data.getUint8(7).toString(baseN);
		state.D7 = '0b'+"00000000".substr(state.D7.length) + state.D7;
		state.D8 = data.getUint8(8).toString(baseN);
		state.D8 = '0b'+"00000000".substr(state.D8.length) + state.D8;
		state.D9 = data.getUint8(9).toString(baseN);
		state.D9 = '0b'+"00000000".substr(state.D9.length) + state.D9;
		state.D10 = data.getUint8(10).toString(baseN);
		state.D10 = '0b'+"00000000".substr(state.D10.length) + state.D10;
		state.D11 = data.getUint8(11).toString(baseN);
		state.D11= '0b'+"00000000".substr(state.D11.length) + state.D11;
		state.D12 = data.getUint8(12).toString(baseN);
		state.D12 = '0b'+"00000000".substr(state.D12.length) + state.D12;
		state.D13 = data.getUint8(13).toString(baseN);
		state.D13 = '0b'+"00000000".substr(state.D13.length) + state.D13;
		state.D14 = data.getUint8(14).toString(baseN);
		state.D14 = '0b'+"00000000".substr(state.D14.length) + state.D14;
		state.D15 = data.getUint8(15).toString(baseN);
		state.D15 = '0b'+"00000000".substr(state.D15.length) + state.D15;
		state.D16 = data.getUint8(16).toString(baseN);
		state.D16 = '0b'+"00000000".substr(state.D16.length) + state.D16;
		state.D17 = data.getUint8(17).toString(baseN);
		state.D17 = '0b'+"00000000".substr(state.D17.length) + state.D17;
		state.D18 = data.getUint8(18).toString(baseN);
		state.D18 = '0b'+"00000000".substr(state.D18.length) + state.D18;
		state.D19 = data.getUint8(19).toString(baseN);
		state.D19 = '0b'+"00000000".substr(state.D19.length) + state.D19;
		onStateChangeCallback( state );

	}

	function onStateChangeCallback() {}

	//

	return {
		connect: connect,
		onStateChange: function ( callback ) {
			onStateChangeCallback = callback;
		}
	}

}
