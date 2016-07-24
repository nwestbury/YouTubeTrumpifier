var trumpComments = [
    "An ‘extremely credible source’ has called my office and told me that Barack Obama’s birth certificate is a fraud.",
    "Robert Pattinson should not take back Kristen Stewart. She cheated on him like a dog & will do it again – just watch.",
    "Ariana Huffington is unattractive, both inside and out. I fully understand why her former husband left her for a man.",
    "You know, it really doesn’t matter what the media write as long as you’ve got a young, and beautiful, piece of ass.",
    "I will build a great wall – and nobody builds walls better than me, believe me – and I’ll build them very inexpensively. I will build a great, great wall on our southern border, and I will make Mexico pay for that wall. Mark my words.",
    "When Mexico sends its people, they’re not sending the best. They’re not sending you, they’re sending people that have lots of problems and they’re bringing those problems with us. They’re bringing drugs. They’re bring crime. They’re rapists… And some, I assume, are good people.",
    "Our great African-American President hasn’t exactly had a positive impact on the thugs who are so happily and openly destroying Baltimore",
    "If I were running ‘The View’, I’d fire Rosie O’Donnell. I mean, I’d look at her right in that fat, ugly face of hers, I’d say ‘Rosie, you’re fired.",
    "All of the women on The Apprentice flirted with me – consciously or unconsciously. That’s to be expected.",
    "The beauty of me is that I’m very rich.",
    "It’s freezing and snowing in New York – we need global warming!",
    "I’ve said if Ivanka weren’t my daughter, perhaps I’d be dating her.",
    "My fingers are long and beautiful, as, it has been well documented, are various other parts of my body.",
    "You’re disgusting.",
    "I think the only difference between me and the other candidates is that I’m more honest and my women are more beautiful.",
    "The point is, you can never be too greedy.",
    "Sorry, there is no STAR on the stage tonight!",
    "My Twitter has become so powerful that I can actually make my enemies tell the truth.",
    "My IQ is one of the highest — and you all know it! Please don't feel so stupid or insecure; it's not your fault.",
    "I have so many fabulous friends who happen to be gay, but I am a traditionalist.",
    "Thanks sweetie. That’s nice.",
    "I was down there, and I watched our police and our firemen, down on 7-Eleven, down at the World Trade Center, right after it came down.",
    "The only card [Hillary Clinton] has is the woman's card. She's got nothing else to offer and frankly, if Hillary Clinton were a man, I don't think she'd get 5 percent of the vote. The only thing she's got going is the woman's card, and the beautiful thing is, women don't like her."
]

function loadimg (url){
    var img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;
    return img;
}

function toggleActive (active, canvas){
    if(active){
	$('#canvas').show();
	$('#placeholder-player > div').hide();
	$('#player').hide();
    }else{
	$('#canvas').hide();
	$('#placeholder-player > div').show();
	$('#player').show();
    }
}


$( document ).ready(function() {
    var video = $('video');
    var domVideo = video.get(0);
    var width = video.width();
    var height = video.height();
    var fps = 10.0;
    var updateRate = 1000.0 / fps;
    var active = true;

    var canvas = $('<canvas/>', {id: 'canvas'}).prop({
	width: width,
        height: height,
    });

    var domCanvas = canvas.get(0);
    var ctx = domCanvas.getContext("2d");
    var running = typeof (domVideo) === 'undefined' ? false : !domVideo.paused;

    var trump  = loadimg(chrome.extension.getURL('img/trump.png'));
    var trump2 = loadimg(chrome.extension.getURL('img/trump2.png'));

    $('#placeholder-player').append(canvas);

    function update(){
	ctx.drawImage(domVideo, 0, 0, video.width(), video.height());
	
	var comp = ccv.detect_objects({ "canvas" : (ccv.pre(domCanvas)),
					"cascade" : cascade,
					"interval" : 5,
					"min_neighbors" : 1 });

	for (var i = 0; i < comp.length; i++) {
	    ctx.drawImage(trump, comp[i].x-comp[i].width*0.25, comp[i].y-comp[i].height*0.75, comp[i].width*1.5, comp[i].height*2);
	}
	if(!domVideo.paused && !domVideo.ended && active){
	    setTimeout(update, updateRate);
	}
    }
    
    chrome.runtime.onMessage.addListener(
	function(settings, sender, sendResponse) {
	    console.log("got response", settings);
	    fps = settings.fps;
	    updateRate = 1000.0 / fps;
	    active = settings.active;
	    toggleActive(active, canvas);

	    if(active){
		update();
	    }
    });
    
    $('video').on('play', function (e) {
	if(active){
	    update();
	}
    });

    $('#placeholder-player').click(function(){
	console.log("TES");
	if(domVideo.paused){
	    domVideo.play();
	}else{
	    domVideo.pause();
	}
    });
    
    $(document).scroll(function(){
	$('.comment-renderer-text-content').each(function(){
	    $(this).addClass('trumpComment').removeClass('comment-renderer-text-content');
	    var comment = trumpComments[Math.floor(Math.random()*trumpComments.length)];
	    $(this).html(comment);
	});
    });


    toggleActive(true, canvas);
    
    if(running){
	update();
    }
});
