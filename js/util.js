var Util =  {
    juiceBounce: function(now, seed, duration, factor) {
    	var juice = ((now+seed)%duration)/duration;
        if(juice > 0.5) {
            juice = 1-juice;
        }

        return juice*factor;
    }
}