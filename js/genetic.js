Math.randomInt = function(min, max)
{
	return Math.floor(Math.random() * (max - min)) + min;
};

Array.prototype.random = function()
{
	return this[Math.randomInt(0, this.length)];
};

var Genetic = function(l, c, b, t)
{
	this.length = l;
	this.count = c;
	this.best_count = b;
	this.types = t;
	this.generation = 0;
	this.genetics = [];
	this.scores = [];
	
	for(var i=0;i<c;i++)
	{
		this.genetics[i] = this.random_genetic();
	}
};

Genetic.prototype = {
	
	constructor: Genetic,
	
	new_genetic : function()
	{
		var tmp_genetics = [], tmp_genetic;
		
		for(var i=0;i<this.count;i++)
		{
			for(var j=0;j<this.best_count;j++)
			{
				var val = tmp_genetics[j] !== undefined ? this.scores[tmp_genetics[j].key] : 0;
				if(val < this.scores[i])
				{
					for(var k=this.best_count-1;k>j;k--)
					{
						tmp_genetics[k] = tmp_genetics[k-1];
					}
					tmp_genetics[j] = { key:i, val:this.genetics[i] };
					break;
				}
			}
		}
		
		for(var i=0;i<this.count;i++)
		{
			for(var j=0;j<this.length;j++)
			{
				tmp_genetic = tmp_genetics.random();
				if(Math.random() < 0.002)
				{
					this.genetics[i][j] = this.types.random();
				}
				else if(this.genetics[i][j] !== tmp_genetic.val[j])
				{
					this.genetics[i][j] = tmp_genetic.val[j];
				}
			}
		}
		
		this.generation++;
	},
	
	random_genetic : function()
	{
		var genetic = [];
		for(var i=0;i<this.length;i++)
		{
			genetic[i] = this.types.random();
		}
		return genetic;
	},
	
	set_score : function(idx, val)
	{
		this.scores[idx] = val;
	}
};