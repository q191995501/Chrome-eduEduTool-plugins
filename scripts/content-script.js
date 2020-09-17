(function() {
	console.log('Listening  success!' );
	window.addEventListener("message", function(e)
	{
			
			//获取数据
		if(e.origin.indexOf("edu-edu.com")!=-1 && e.data.code==100){
			
			chrome.storage.local.get("data",function(res){
				console.log(res)
				window.postMessage({"code": 101,"data":res.data});
			})
			
		}
		// 保存数据
		else if(e.origin.indexOf("edu-edu.com")!=-1 && e.data.code==102){
			chrome.storage.local.set({"data":e.data.data},function(){
				console.log("保存成功")
			})
			
		}
		
		else if(e.origin.indexOf("edu-edu.com")!=-1 && e.data.code==103){
			 chrome.storage.local.remove('data', function() {
			        console.log('remove ');
			 });
			
		}

	}, false);
})();


const script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.setAttribute('src', chrome.extension.getURL('scripts/jquery-1.11.3.min.js'));
document.head.appendChild(script);


// 在页面上插入代码
const script1 = document.createElement('script');
script1.setAttribute('type', 'text/javascript');
script1.setAttribute('src', chrome.extension.getURL('scripts/main.js'));
document.head.appendChild(script1);


