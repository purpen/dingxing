/*
 * Topct base js 
 */

var topct = {
	    // 当前访问者用户信息
	    visitor: {},
		url : {},
		redirect: function(url,delay) {
	        setTimeout(function(){
				window.location = url;
			},delay);
	    },
	    show_error_note: function(msg,delay) {
			msg = '<div class="content"><i class="remove sign icon"></i>'+ msg +'</div>';
	    	phenix.show_notify_bar(msg,'error',delay);
	    },
	    show_ok_note:function(msg,delay) {
			msg = '<div class="content"><i class="checkmark icon"></i>'+ msg +'</div>';
	    	phenix.show_notify_bar(msg,'ok', delay);
	    },
	    show_notify_bar: function(msg,type,delay) {
            var class_name;
	        if(!type || type == 'ok'){
	        	type = 'ok';
				class_name = 'success';
	        }else{
				type = 'error';
				class_name = 'error';
	        }
			
			$.gritter.add({
				title: '',
				text: msg,
				time: delay,
				class_name: class_name,
			});
	    }
};

topct.before_submit = function() {
	$('.ui.submit.button').addClass('loading');
	$('.ui.error.message').remove();
	return true;
};

topct.after_submit = function() {
	$('.ui.submit.button').removeClass('loading');
	return true;
};

/*
 * 初始化,设置常用的ajax hook
 */
topct.initial = function(){
	
	/* 此类为确认后执行的ajax操作 */
	$('a.confirm-request').livequery(function(){
		$(this).click(function(){
			if(confirm('确认执行这个操作吗?')){
	        	$.get($(this).attr('href'));
	        }
	        return false;
		});
	});	
    
    /* 此类为ajax链接 */
	$('a.ajax').livequery(function(){
		$(this).click(function(){
			var res_url = $(this).attr('href');
			// 所有ajax请求，验证是否登录
			if (!topct.visitor.is_login){
				topct.show_login_box(res_url);
				return false;
			}
			// 发送ajax请求
			$.get(res_url);
			
	        return false;
		});
	});
	
	// 消息框
	$('.ui.message .close').livequery(function(){
		$(this).on('click', function() {
			$(this).closest('.ui.message').fadeOut('slow');
		});
	});
	
	// 取消并返回上一步
	$('.ui.cancel.button').bind('click', function(){
		window.location.href = document.referrer;
	});
	
	$('.ui.pop').popup();
	
	$('.ui.checkbox').checkbox();
	
	$('.ui.selection.dropdown').dropdown();
	
	$('.ui.dropdown').dropdown({
		on  : 'hover'
	});
	
	$('.ui.accordion').accordion();
	
};

// 显示登录弹出框
topct.show_login_box = function(next_res_url) {
    /* 登录表单验证 */
	$('#loginbox-form').form({
		account: {
			identifier  : 'account',
			rules: [
				{
					type   : 'empty',
					prompt : '输入你注册时填写的邮件或手机号码'
				}
			]
		},
		password: {
			identifier  : 'password',
			rules: [
				{
					type   : 'empty',
					prompt : '输入正确的登录密码'
				},
				{
					type   : 'length[6]',
					prompt : '登录密码为必须6位以上字符'
				}
			]
		}
	}, {
		inline : true,
		onSuccess: function(event){
			event.preventDefault();
			$(this).ajaxSubmit({
				dataType: 'json',
				beforeSubmit: function(){
					phenix.before_submit();
				},
				success: function(result){
					phenix.after_submit();
					
					if(result.is_error){
						$(event.target).addClass('error');
						phenix.show_error_note(result.message);
					}else{
						$('.ui.loginbox.modal').modal('hide');
						phenix.visitor = result.data;
						// 登录成功后，自动发送ajax请求
						if (next_res_url) {
							$.get(next_res_url);
						}
					}
				}
			});
		}
	});
	
	// 显示登录框
	$('.ui.loginbox.modal').modal('show');
}

/*
 * 显示/隐藏区块
 */
topct.showbox = function() {
    $('.showbox').livequery(function(){
		$(this).click(function(){
	        var el =  this.hash && this.hash.substr(1);
			$('#'+el).toggle();
	        return false;
		});
    });
};

/*
 * 登录,注册页 
 */
topct.build_auth_page = function() {
    /* 登录表单验证 */
	$('#login-form').form({
		account: {
			identifier  : 'account',
			rules: [
				{
					type   : 'empty',
					prompt : '请输入您注册时填写的邮件或手机号码'
				}
			]
		},
		password: {
			identifier  : 'password',
			rules: [
				{
					type   : 'empty',
					prompt : '请输入正确的登录密码'
				},
				{
					type   : 'length[6]',
					prompt : '登录密码为必须6位以上字符'
				}
			]
		}
	}, {
		inline : true,
		onSuccess: function(event){
			event.preventDefault();
			$(this).ajaxSubmit({
				dataType: 'json',
				beforeSubmit: function(){
					topct.before_submit();
				},
				success: function(data){
					topct.after_submit();
					
					if(data.is_error){
						topct.show_error_note(data.message, 5000);
					}else{
						topct.redirect(data.redirect_url);
					}
					
				}
			});
		}
	});
    
    /*注册表单验证*/
	$('#register-form').form({
		account: {
			identifier  : 'account',
			rules: [
				{
					type   : 'empty',
					prompt : '账户名称不能为空'
				}
			]
		},
		verify_code: {
			identifier  : 'verify_code',
			rules: [
				{
					type   : 'empty',
					prompt : '验证码不能为空'
				}
			]
		},
		password: {
			identifier  : 'password',
			rules: [
				{
					type   : 'empty',
					prompt : '请输入正确的登录密码'
				},
				{
					type   : 'length[6]',
					prompt : '登录密码必须6位以上字符'
				}
			]
		},
		password_confirm: {
			identifier  : 'password_confirm',
			rules: [
				{
					type   : 'empty',
					prompt : '请输入正确的确认密码'
				},
				{
					type   : 'match[password]',
					prompt : '两次输入密码不一致'
				}
			]
		}
	}, {
		inline : true,
		onSuccess: function(event){
			event.preventDefault();
			$(event.target).ajaxSubmit({
				dataType: 'json',
				beforeSubmit: function(){
					topct.before_submit();
				},
				success: function(data){
					topct.after_submit();
					
					if(data.is_error){
						topct.show_error_note(data.message, 5000);
					}else{
						topct.redirect(data.redirect_url);
					}
					
				}
			});
		}
	});
};

// 处理批量附件
topct.rebuild_batch_assets = function(id){
	var batch_assets = $('#batch_assets').val();
	if (batch_assets){
		var asset_ids = batch_assets.split(',');
		if ($.inArray(id, asset_ids) == -1){
			asset_ids.push(id);
			
			$('#batch_assets').val(asset_ids.join(','));
		}
	}else{
		$('#batch_assets').val(id);
	}
};

/**
 * 全局变量声明
 */
var wps_width=0, wps_height=0, wps_ratio=1;
var scale_width=480, scale_height=0;
var crop_width=0, crop_height=0;

/**
 * hook image area select
 */
topct.hook_imgarea_select = function(){
	scale_height = parseInt(wps_height*scale_width/wps_width);
	ias = $('img#avatar-photo').imgAreaSelect({
		aspectRatio: '1:1',
		x1: 0, 
		y1: 0, 
		x2: 300, 
		y2: 300,
		handles: true,
		parent: '#select-area',
		fadeSpeed: 200,
		instance: true,
		onSelectChange: phenix.preview,
		onSelectEnd: phenix.updateAreaSelect
	});
};

topct.preview = function(img, selection) {
	if (!selection.width || !selection.height){
		return;
	}
	$('#x1').val(selection.x1);
	$('#y1').val(selection.y1);
	$('#x2').val(selection.x2);
	$('#y2').val(selection.y2);
	$('#w').val(selection.width);
	$('#h').val(selection.height);
};

topct.updateAreaSelect = function() {
	// todo
};
/**
 * imgAreaSelect settings
 */
$.extend($.imgAreaSelect.prototype, {
    animateSelection: function (x1, y1, x2, y2, duration) {
        var fx = $.extend($('<div/>')[0], {
            ias: this,
            start: this.getSelection(),
            end: { x1: x1, y1: y1, x2: x2, y2: y2 }
        });
		
        $(fx).animate({
            cur: 1
        },
        {
            duration: duration,
            step: function (now, fx) {
                var start = fx.elem.start, end = fx.elem.end,
                    curX1 = Math.round(start.x1 + (end.x1 - start.x1) * now),
                    curY1 = Math.round(start.y1 + (end.y1 - start.y1) * now),
                    curX2 = Math.round(start.x2 + (end.x2 - start.x2) * now),
                    curY2 = Math.round(start.y2 + (end.y2 - start.y2) * now);
                fx.elem.ias.setSelection(curX1, curY1, curX2, curY2);
                fx.elem.ias.update();
            }
        });
    }
});

(function($){
	$.fn.extend({
		insertAtCaret: function(myValue){
			var $t=$(this)[0];
			if (document.selection) {
				this.focus();
				sel = document.selection.createRange();
				sel.text = myValue;
				this.focus();
			}
			else 
				if ($t.selectionStart || $t.selectionStart == '0') {
					var startPos = $t.selectionStart;
					var endPos = $t.selectionEnd;
					var scrollTop = $t.scrollTop;
					$t.value = $t.value.substring(0, startPos) + myValue + $t.value.substring(endPos, $t.value.length);
					this.focus();
					$t.selectionStart = startPos + myValue.length;
					$t.selectionEnd = startPos + myValue.length;
					$t.scrollTop = scrollTop;
				}
				else {
					this.value += myValue;
					this.focus();
				}
		}
	})	
})(jQuery);
