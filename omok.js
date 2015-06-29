$(function() {
	
	var XCOUNT = 20,
		YCOUNT = 20;
	
	function set_info()
	{
		var $figures = $('.omok-stone-figure');
		$('.layer-omok-info').removeClass('ohd');
		$figures.on('click', function(e) {
			if(this.className.indexOf('omok-stone-selected') > -1) return;
			$figures.toggleClass('omok-stone-selected');
		});
	}
	
	function set_board()
	{
		
	}
	
	function main()
	{
		set_info();
	}
	
	main();
});