var  gloabData=null
window.addEventListener("message", function(e){
		//获取值
		if(e.origin.indexOf("edu-edu.com")!=-1 && e.data.code==101){
			
			gloabData=e.data.data
			console.log(gloabData)
			if(gloabData==null){
				gloabData={}
			}
			
			init();
		}
}, false);

window.postMessage({"code":100})


view=function(client){
    		var self=this;
    		self.client=client;
    		$(document).ajaxError(function(event, jqXHR, ajaxSettings, thrownError){/*对ajax发生错误的处理*/
    			 var msg='抱歉！当前操作失败，请检查您的网络。点击<a href="'+window.location+'">这里</a>刷新。';
    			 self.Message(msg, 'err');
    		});
    		$.get(self.basePath+'/myanswer/list/'+self.userExamId,{},function(data){			
    			if(data&&data.success){
    				var userAnswers = data.answers;
    				self.client.__OnInited(userAnswers); //显示用户的答案
    				
    				$.get(self.basePath+'/answer/'+self.userExamId,{},function(data){	
    					if(data&&data.success){
    						var paperAnswers = data.answers;
    						self.client.__ShowUserAnswerRightStatus(paperAnswers); 
    						if(self.allowSeeAnswer){  //显示正确答案
    							self.client.__ShowAnswerAndHint(paperAnswers); //显示正确答案和提示
    						}
    				
    						for(let i=0;i<paperAnswers.length;i++){
    							let p=paperAnswers[i]
    							gloabData[p.questionId]=p.answer
    						}
    				
							window.postMessage({"code":102,"data":gloabData})
			                self.Message('网页加载完成，开始嘿嘿嘿吧', 'err');
					        setTimeout(function(){ self.CloseDialog() }, 3000);
							
    					}else{
    						self.Message('获取试卷答案失败，请重试！', 'err');
    					}			
    				},'json');
    				
    			}else{
    				self.Message('获取您的答案失败，请重试！', 'err');
    			}			
    		},'json');
			
    	};	


function saveAnswer(qId, psqId, qa,self) {
	$.post('/exam/student/exam/myanswer/save/' + self.userExamId + '/' + qId, { psqId: psqId, answer: qa }, function (data) {
		
	}, 'json');
}
		
		
exam=function (client) {
		var self = this;
		self.client = client;
	
		$(document).ajaxError(function (event, jqXHR, ajaxSettings, thrownError) {/*对ajax发生错误的处理*/
			var msg = '当前操作失败，请检查您的网络。点击<a href="' + window.location + '">这里</a>刷新。';
			self.Message(msg, 'err');
		});

		
		$.get(self.basePath + '/myanswer/list/' + self.userExamId, {}, function (data) {
			self.inited = true;
            function countTime() {
                if (self.leftTime <= 0) {
                    clearInterval(self.interval);
                    self.Submit(true);
                    return;
                }
                self.leftTime = self.leftTime - 1000;
                if (self.leftTime < 0) {
                    self.leftTime = 0;
                }
                var m = parseInt(self.leftTime / 60000);
                var s = parseInt((self.leftTime % 60000) / 1000);
                self.leftTimeDiv.text(m + ':' + (s > 9 ? s : ('0' + s)));
                if (m < 5) {
                    self.leftTimeDiv.addClass('alert');
                }
            }
			if (data && data.success) {
				let paperAnswers=data.answers
				let selfdoc=$(".ui-paper-iframe")[0].contentWindow.document
				for(let i=0;i<paperAnswers.length;i++){
					let p=paperAnswers[i]
					let  an=gloabData[p.id]
					if(an!=null){
						p.answer=an
						console.log("kaishi ")
						let code=selfdoc.getElementById("q_"+p.id).getAttribute("code").replace("psq_","")
						saveAnswer(p.id,code,p.answer,self)
					}
				
				}
				self.client.__OnInited(paperAnswers);
                self.Message('网页加载完成，开始嘿嘿嘿吧', 'err');
                setTimeout(function(){ self.CloseDialog() }, 3000);
			} else {
				self.Message('获取上次的答案失败，您需要重新进行答卷！', 'err');
				self.client__OnInited(null);
			}
			if (self.limitTime > 0) {
				countTime();
				self.leftTimeDiv.show();
				self.interval = setInterval(countTime, 1000);
			}
		}, 'json');
	};

doexam=function(client){
		var self=this;
		self.client=client;
		$(document).ajaxError(function(event, jqXHR, ajaxSettings, thrownError){/*对ajax发生错误的处理*/
			 var msg='当前操作失败，请检查您的网络,刷新后确认答案是否都正确提交!';
			 self.Message(msg, 'err',[{label:'刷新',func:function(){window.location.reload()}}],true);
		});
		$.get(self.basePath+'/myanswer/list/'+self.userExamId,{},function(data){
			self.inited=true;
			function countTime(){
				if(self.leftTime<=0){
					clearInterval(self.interval);
					self.Submit(true);
					return;
				}
				self.leftTime=self.leftTime-1000;
				if(self.leftTime<0){
					self.leftTime=0;
				}
				var m=parseInt(self.leftTime/60000);
				var s=parseInt((self.leftTime%60000)/1000);
				self.leftTimeDiv.text(m+':'+(s>9?s:('0'+s)));
				if(m<5){
					self.leftTimeDiv.addClass('alert');
				}
			}
			if(data && data.success){
				if(data.answers!=""){
					let paperAnswers=data.answers
					let selfdoc=$(".ui-paper-iframe")[0].contentWindow.document
					for(let i=0;i<paperAnswers.length;i++){
						let p=paperAnswers[i]
						let  an=gloabData[p.id]
						if(an!=null){
							p.answer=an
							console.log("kaishi ")
							let code=selfdoc.getElementById("q_"+p.id).getAttribute("code").replace("psq_","")
							saveAnswer(p.id,code,p.answer,self)
						}
					
					}
					self.client.__OnInited(data.answers);
					self.Message('网页加载完成，开始嘿嘿嘿吧', 'err');
					setTimeout(function(){ self.CloseDialog() }, 3000);
				}else{
					/*里面有初使化问答题的脚本，需要执行一次*/
					self.client.__OnInited(null);
				}
			}else{
				self.Message('获取您上次的答案失败，您需要重新进行答卷！', 'err');
				self.client.__OnInited(null);
			}
			self.client.__InitLinks();
			if(self.limitTime>0){
				countTime();
				self.leftTimeDiv.show();
				self.interval=setInterval(countTime,1000);
			}
		},'json');
};


function init(){
	
	
	if(document.URL.indexOf("dostart")!=-1){
		 ExamObj.prototype.Init=exam
		 var removeDataALL=0;
		 ExamObj.prototype.CheckUndone = function () {
				var ret = this.client.__CheckUndone();
				if (ret.count > 0) {
					this.Message('您还有' + ret.count + '道题没有做，已经高亮显示', 'warn');
				} else {
					this.Message('您已经做完所有的题目 ！', 'pass');
				}
			removeDataALL++;
			setTimeout(function(){
				if(removeDataALL>=3){
					window.postMessage({"code":103})
				}
				removeDataALL=0;
				
			}, 500);
				
		 };
	}else if(document.URL.indexOf("doview")!=-1){
        ExamObj.prototype.Init=view
	}
	else if(document.URL.indexOf("doexam")!=-1){
		ExamObj.prototype.Init=doexam
	}
	
}


	