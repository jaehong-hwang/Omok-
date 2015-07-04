$(function() {
	
	var BOARD_WIDTH = 580,
		BOARD_HEIGHT = 580,
	
	
	Board = function(w, h)
	{
		var $figures, self = this, rows, i, j;
		
		this.layer = $('.layer-omok-modal').removeClass('ohd');
		
		this.width = w;
		this.height = h;
		this.cellWidth = BOARD_WIDTH / (w-1);
		this.cellHeight = BOARD_HEIGHT / (h-1);
		
		this.info = $('.omok-modal-info');
		this.boardWrap = $('.omok-modal-board');
		this.canvas = $('.omok-board');
		this.ctx = this.canvas[0].getContext('2d');
		
		this.figures = $figures = $('.omok-stone-figure', this.info);
		$figures.on('click', function(e) {
			if(this.className.indexOf('omok-stone-selected') > -1) return;
			$figures.toggleClass('omok-stone-selected');
		});
		
		$('.omok-start', this.info).on('click', function() {
			self.gameStart();
		});
		
		return this;
	}, Omok;
	
	Board.prototype = {
		
		constructor : Board,
		
		openInfo : function()
		{
			this.figures[0].click();
			this.info.removeClass('omok-modal-info-close')
					.addClass('omok-modal-info-open');
		},
		
		closeInfo : function()
		{
			this.info.removeClass('omok-modal-info-open')
					.addClass('omok-modal-info-close');
		},
		
		openBoard : function()
		{
			var self = this;
			
			this.boardWrap.addClass('omok-modal-board-open');
			
			setTimeout(function() {
				self.layer.addClass('layer-omok-playing');
			}, 900);
			
			setTimeout(function() {
				$('.ohd', self.layer).removeClass('ohd');
			}, 1800);
		},
		
		drawBoard : function()
		{
			var i, j, a=[3,Math.floor(this.width/2),this.width-4];
			
			for(i=0;i<this.width-2;i++)
			{
				this.ctx.moveTo((i+1)*this.cellWidth, 0);
				this.ctx.lineTo((i+1)*this.cellWidth, BOARD_HEIGHT);
			}
			
			for(i=0;i<this.height-2;i++)
			{
				this.ctx.moveTo(0, (i+1)*this.cellHeight);
				this.ctx.lineTo(BOARD_WIDTH, (i+1)*this.cellHeight);
			}
			
			this.ctx.strokeStyle = '#888';
			this.ctx.stroke();
			
			this.ctx.fillStyle = '#888';
			
			for(i=0;i<3;i++)
			{
				for(j=0;j<3;j++)
				{
					this.ctx.beginPath();
					this.ctx.arc(a[i]*this.cellWidth, a[j]*this.cellHeight, 2, 0, Math.PI*2, true);
					this.ctx.closePath();
					this.ctx.fill();
				}
			}
		},
		
		gameStart : function()
		{
			var self = this;
			
			this.closeInfo();
			this.drawBoard();
			
			setTimeout(function()
				{
					self.openBoard();
				},
				1500
			);
		}
	};
	
	Omok = new Board(13, 13);
});