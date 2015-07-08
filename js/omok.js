$(function() {
	
	
	var Board = function(w, h)
	{
		var BOARD_WIDTH = 580,
			BOARD_HEIGHT = 580,
			$figures, self = this;
		
		this.layer = $('.layer-omok-modal').removeClass('ohd');
		
		this.width = w;
		this.height = h;
		this.boardWidth = BOARD_WIDTH;
		this.boardHeight = BOARD_HEIGHT;
		this.cellWidth = BOARD_WIDTH / (w-1);
		this.cellHeight = BOARD_HEIGHT / (h-1);
		
		this.stones = $('#black-stone');
		this.info = $('.omok-modal-info');
		this.boardWrap = $('.omok-modal-board');
		this.canvas = $('.omok-board');
		this.ctx = this.canvas[0].getContext('2d');
		
		this.stonesVec = {
			'black' : [],
			'white' : []
		};
		
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
		
		attack : function(color, vec)
		{
			this.stonesVec[color].push(vec);
		},
		
		drawBoard : function()
		{
			var i, j, f, vec, lw, self = this,
				a = [3,Math.floor(this.width/2),this.width-4];
			
			this.ctx.clearRect(0, 0, this.canvas[0].width, this.canvas[0].height); 
			
			this.ctx.lineWidth = 1;
			
			for(i=0;i<this.width-2;i++)
			{
				this.ctx.moveTo((i+1)*this.cellWidth, 0);
				this.ctx.lineTo((i+1)*this.cellWidth, this.boardHeight);
			}
			
			for(i=0;i<this.height-2;i++)
			{
				this.ctx.moveTo(0, (i+1)*this.cellHeight);
				this.ctx.lineTo(this.boardWidth, (i+1)*this.cellHeight);
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
					this.ctx.stroke();
				}
			}
			
			
			
			['black', 'white'].forEach(function(color) {
				
				for(i=0,f=self.stonesVec[color].length;i<f;i++)
				{
					vec = self.stonesVec[color][i];
					
					self.ctx.strokeStyle = '#888';
					self.ctx.lineWidth = lw = self.cellWidth / 2.5 + 1;
					
					self.ctx.beginPath();
					self.ctx.arc(vec[0]*self.cellWidth, vec[1]*self.cellHeight, lw / 2, 0, Math.PI*2, true);
					self.ctx.closePath();
					self.ctx.stroke();
					
					self.ctx.strokeStyle = color;
					self.ctx.lineWidth = lw = self.cellWidth / 2.5;
					
					self.ctx.beginPath();
					self.ctx.arc(vec[0]*self.cellWidth, vec[1]*self.cellHeight, lw / 2, 0, Math.PI*2, true);
					self.ctx.closePath();
					self.ctx.stroke();
				}
			});
			
			window.requestAnimationFrame(function() {
				self.drawBoard.call(self);
			});
		},
		
		getCell : function(x, y)
		{
			return [
				Math.round(x / this.cellWidth),
				Math.round(y / this.cellHeight)
			];
		},
		
		isSameCell : function(v1, v2)
		{
			return v1[0] === v2[0] && v1[1] === v2[1];
		},
		
		isEmptyCell : function(cell)
		{
			var self = this, vecs = this.stonesVec, vec, i, f, empty = true;
			
			['black', 'white'].forEach(function(color) {
				vec = vecs[color];
				
				for(i=0,f=vec.length;i<f;i++)
				{
					if(self.isSameCell(vec[i], cell))
					{
						empty = false;
						return;
					}
				}
			});
			
			return empty;
		},
		
		playerTurn : function(pc, ac)
		{
			var self = this, cell;
			
			this.canvas.on('click', function(e) {
				cell = self.getCell(e.offsetX, e.offsetY);
				
				if(cell[0] > 0 && cell[0] < self.width - 1 && self.isEmptyCell(cell))
				{
					console.log(1);
					self.attack(pc, cell);
				}
			});
			
			this.gameAction(ac, pc, ac);
		},
		
		aiTurn : function(pc, ac)
		{
			//this.gameAction(pc, pc, ac);
		},
		
		gameAction : function(turn, pc, ac)
		{
			if(turn === pc)
			{
				this.playerTurn(pc, ac);
			}
			else
			{
				this.aiTurn(pc, ac);
			}
		},
		
		gameStart : function()
		{
			var self = this,
				playerColor = this.stones[0].checked === true ? 'black' : 'white',
				aiColor = playerColor === 'black' ? 'white' : 'black',
				turn = playerColor === 'black' ? playerColor : aiColor;
			
			this.closeInfo();
			this.drawBoard();
			
			setTimeout(function() {
				self.openBoard();
				self.gameAction(turn, playerColor, aiColor);
			}, 1500);
		}
	};
	
	Omok = new Board(13, 13);
});