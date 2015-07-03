$(function() {
	
	var Board = function(w, h)
	{
		$('.layer-omok-modal').removeClass('ohd');
		
		this.width = w;
		this.height = h;
		this.info = $('.omok-modal-info');
		
		var $figures = $('.omok-stone-figure');
		$figures.on('click', function(e) {
			if(this.className.indexOf('omok-stone-selected') > -1) return;
			$figures.toggleClass('omok-stone-selected');
		});
		
		return this;
	}, Omok;
	
	Board.prototype = {
		
		constructor : Board,
		
		openInfo : function()
		{
			this.info.removeClass('omok-modal-info-close')
					.addClass('omok-modal-info-open');
		},
		
		closeInfo : function()
		{
			this.info.removeClass('omok-modal-info-open')
					.addClass('omok-modal-info-close');
		}
	};
	
	Omok = new Board(19, 19);
});