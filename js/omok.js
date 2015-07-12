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
		
		this.shadowVec = null;
		
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
		
		attack : function(vecs, color, vec)
		{
			vecs[color].push(vec);
			return vecs;
		},
		
		drawStones : function(vec, color, stroke)
		{
			var lw;
			
			this.ctx.strokeStyle = stroke || '#888';
			this.ctx.lineWidth = lw = this.cellWidth / 2.5 + 0.5;
			
			this.ctx.beginPath();
			this.ctx.arc(vec[0]*this.cellWidth, vec[1]*this.cellHeight, lw / 2, 0, Math.PI*2, true);
			this.ctx.closePath();
			this.ctx.stroke();
			
			this.ctx.strokeStyle = color;
			this.ctx.lineWidth = lw = this.cellWidth / 2.5;
			
			this.ctx.beginPath();
			this.ctx.arc(vec[0]*this.cellWidth, vec[1]*this.cellHeight, lw / 2, 0, Math.PI*2, true);
			this.ctx.closePath();
			this.ctx.stroke();
		},
		
		drawBoard : function(pc)
		{
			var i, j, f, vec, self = this,
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
					self.drawStones(vec, color);
				}
			});
			
			if(self.shadowVec !== null)
			{
				self.drawStones(self.shadowVec, 'rgba('+(pc === 'black' ? '0,0,0' : '255,255,255')+',0.3)', 'rgba(136,136,136,0.3)');
			}
			
			window.requestAnimationFrame(function() {
				self.drawBoard.call(self, pc);
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
		
		isEmptyCell : function(vecs, cell)
		{
			var self = this, vec, i, f, vecColor = '';
			
			['black', 'white'].forEach(function(color) {
				vec = vecs[color];
				
				for(i=0,f=vec.length;i<f;i++)
				{
					if(self.isSameCell(vec[i], cell))
					{
						vecColor = color;
						return;
					}
				}
			});
			
			return vecColor || true;
		},
		
		getLine : function(vecs, color, x, y, sx, sy)
		{
			var line = [], vec = [x,y];
			do {
				line[line.length] = vec;
				x += sx;
				y += sy;
				vec = [x,y];
			} while(this.isEmptyCell(vecs, vec) === color);
			
			return line;
		},
		
		getLines : function(color, vec)
		{
			/*
			 *  오른쪽, 아래, 대각선 아래 검사
			 *	만약 위에 돌이 있을경우 아래 검사안함, 이외에도 마찬가지
			 */
			
			var lines = [], self = this, line;
			vec[color].sort().forEach(function(v) {
				if(self.isEmptyCell(vec, [v[0] - 1, v[1]]) !== color) {
					line = self.getLine(vec, color, v[0], v[1], 1, 0);
					if(line.length > 1) lines[lines.length] = line;
				}
				
				if(self.isEmptyCell(vec, [v[0], v[1] - 1]) !== color) {
					line = self.getLine(vec, color, v[0], v[1], 0, 1);
					if(line.length > 1) lines[lines.length] = line;
				}
				
				if(self.isEmptyCell(vec, [v[0] - 1, v[1] - 1]) !== color) {
					line = self.getLine(vec, color, v[0], v[1], 1, 1);
					if(line.length > 1) lines[lines.length] = line;
				}
			});
			
			return lines;
		},
		
		getScore : function(color, vec)
		{
			var score = 0, lines = this.getLines(color, vec);
			for(var i=0,f=lines.length;i<f;i++)
			{
				if(score < lines[i].length) score = lines[i].length;
			}
			return score;
		},
		
		playerTurn : function(pc, ac)
		{
			var self = this, cell;
			this.canvas.on({
				'click' : function(e) {
					cell = self.getCell(e.offsetX, e.offsetY);
					
					if(cell[0] > 0 && cell[0] < self.width - 1 &&
						cell[1] > 0 && cell[1] < self.height - 1 && self.isEmptyCell(self.stonesVec, cell) === true)
					{
						self.canvas.off('click', 'mousemove');
						self.stonesVec = self.attack(self.stonesVec, pc, cell);
						self.gameAction(ac, pc, ac);
					}
				},
				
				'mousemove' : function(e) {
					cell = self.getCell(e.offsetX, e.offsetY);
					if(cell[0] > 0 && cell[0] < self.width - 1 &&
						cell[1] > 0 && cell[1] < self.height - 1 && self.isEmptyCell(self.stonesVec, cell) === true)
					{
						self.shadowVec = cell;
					}
					else
					{
						self.shadowVec = null;
					}
				}
			});
		},
		
		getRandomEmptyCell : function(vecs, cells)
		{
			var cell, i, f = cells.length, inCell = f > 0;
			
			do {
				cell = [Math.randomInt(1,this.width-1),Math.randomInt(1,this.height-1)];
				for(i=0;i<f;i++)
				{
					if(this.isSameCell(cell, cells[i]) === false)
						inCell = false;
				}
			} while(this.isEmptyCell(vecs, cell) !== true || inCell === true);
			
			return cell;
		},
		
		aiTurn : function(pc, ac)
		{
			console.log(this.stonesVec);
			var cells = [], tempVec = this.stonesVec.slice(0), cell = this.getRandomEmptyCell(tempVec, cells);
			tempVec = this.attack(tempVec, ac, cell);
			this.gameAction(pc, pc, ac);
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
			this.drawBoard(playerColor);
			
			setTimeout(function() {
				self.openBoard();
				self.gameAction(turn, playerColor, aiColor);
			}, 1500);
		}
	};
	
	Omok = new Board(13, 13);
});