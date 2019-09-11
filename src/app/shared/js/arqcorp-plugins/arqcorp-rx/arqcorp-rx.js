//var idSetIntervalUltimaAtividade = null;

jQuery.hubAjax = (function(props) {
	var hubAjaxClass = (function(props) {
		this.doneCallback = null;
		this.failCallback = null;
		this.deliveredCallback = null;
		this.props = props;
		
		this.fire = (function(props) {
			if ($.cookie('arqcorpsessionid') == undefined) {
				var Location = document.location;
				console.log("Iremos redirecion\u00e1-lo para a tela de Login");
				/*$.SmartMessageBox({
					title : '<i class="fa fa-user"></i>&nbsp;&nbsp;Sess&atilde;o Expirada!',
					content : 'Iremos redirecion\u00e1-lo para a tela de Login',
					buttons : '[Tudo Bem]'
				}, function(ButtonPressed) {
					if (ButtonPressed === 'Tudo Bem') {
						window.location = Location.protocol + '//' + Location.hostname + '/index.html?deslogar=true';
					}
				});*/
			} else {
				/*var container = $('#content');
				var $titleObj = null;
				var title = null;
				var titleWait = '<h1 class="ajax-loading-animation"><i class="fa fa-cog fa-spin"></i> Aguarde...</h1>';
				if (container != null && container != undefined) {
					var pagina = location.href;
					if (typeof pagina != 'undefined' && pagina != null && pagina.indexOf('bemVindo') == -1) {
						$titleObj = container.find('.row:eq(0)>div>');
						if ($titleObj != null && $titleObj != undefined) {
							if ($titleObj.html() != titleWait) {
								title = $titleObj.html();
							}
							$titleObj.html(titleWait);
						}
					}
				}*/
				var uuid = null;
				if (props.callbackType != undefined && props.callbackType != null && props.callbackType.type == 'persistent') {
					uuid = props.callbackType.uuid;
					observer.addPersistentObserver(uuid, function(jsonReturn) {
						/*if (title != null) {
							$titleObj.html(title);
							title = null;
							$titleObj = null;
							container = null;
						}*/
						
						if (_self.doneCallback != null && _self.doneCallback != undefined) {
							_self.doneCallback(jsonReturn);
						}
					});
				} else {
					uuid = Math.uuid();
					observer.addObserver(uuid, function(jsonReturn) {
						/*if (title != null) {
							$titleObj.html(title);
							title = null;
							$titleObj = null;
							container = null;
						}*/
						if (_self.doneCallback != null && _self.doneCallback != undefined) {
							_self.doneCallback(jsonReturn);
						}
					});
				}
				
				var headers = {
					headers: {
						'X-Message-Id': uuid, 
						'X-Tela-Id': props.tela, 
						'X-Acao-Id': props.acao
					}
				};
				
				var ajaxFail = 0;
				var ajaxSuccess = 1;
				var ajaxStatus = -1;
				var dataReturned = null;
				$.extend(true, props, headers);
				
				$.ajax(props).success(function(data) {
					// console.log('Requisi\u00e7\u00e3o feita para o uuid: [' + uuid + '] foi entregue com sucesso.');
					 ajaxStatus = ajaxSuccess;
					 dataReturned = data;
				 	//_self.timeSince();
				 	
				 	manipulandocookies.carregarCookiesPrincipais({})
				}).fail(function() {
					ajaxStatus = ajaxFail;
				 	/*if (title != null) {
						$titleObj.html(title);
						title = null;
						$titleObj = null;
						container = null;
				 	}*/
				}).error(function (xhr, ajaxOptions, thrownError) {
					//alerta.processarAlertaDeErro(xhr, ajaxOptions, thrownError);
					 console.log(xhr, ajaxOptions, thrownError);
			    });
				
				if (ajaxStatus == ajaxSuccess) {
					if (_self.deliveredCallback != null) {
						_self.deliveredCallback(dataReturned);
					}
				} else if (ajaxStatus == ajaxFail) {
					if (_self.failCallback != null) {
						_self.failCallback();
					}
				}
				return _self;
			}
		});
		/*
		this.timeSince = (function() {
			function formatTextSince(date) {
				var seconds = Math.floor((new Date() - date) / 1000);
				var months = ['Janeiro', 'Fevereiro', 'Mar\u00e7o', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
	            	if (seconds < 5) {
	            		return 'neste exato momento';
	            	} else if (seconds < 60) {
	            		return seconds + ' segundos atr\u00e1s';
	            	} else if (seconds < 3600) {
	            		var minutes = Math.floor(seconds / 60)
	            		if (minutes > 1) {
	            			return minutes + ' minutos atr\u00e1s';
	            		} else {
	            			return '1 minuto atr\u00e1s';
	            		}
	            	} else if (seconds < 86400) {
	            		var hours = Math.floor(seconds / 3600)
	            		if (hours > 1) {
	            			return hours + ' horas atr\u00e1s';
	            		} else {
	            			return '1 hora atr\u00e1s';
	            		}
	            	} else if (seconds < 172800) {
	            		var days = Math.floor(seconds / 86400)
	            		if (days > 1) {
	            			return days + ' dias atr\u00e1s';
	            		} else {
	            			return '1 dia atr\u00e1s';
	            		}
	            	} else {
	            		return date.getDate().toString() + ' ' + months[date.getMonth()] + ', ' + date.getFullYear();
	            	}
			}
			
			clearInterval(idSetIntervalUltimaAtividade);
		 	var date = new Date();
		 	setTimeout(function() {
		 		idSetIntervalUltimaAtividade = setInterval(function() {
		 			var hora = formatTextSince(date);
		 			$('#ultimaAtividade').empty().append(hora);
		 		}, 5000);
		 	});
        });
		*/
		this.done = (function(callback) {
			_self.doneCallback = callback;
			_self.fire(_self.props);
			return _self;
		});
		
		this.delivered = (function(callback) {
			_self.deliveredCallback = callback;
			return _self;
		});
		
		this.fail = (function(callback) {
			_self.failCallback = callback;
			return _self;
		});
		
		var _self = this;
	});
	return new hubAjaxClass(props);
});
//Global variable to hubAjax class
//var hubAjax = $.hubAjax();