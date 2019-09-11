var manipulandocookies = {
	tempoParaExpirarFuncionalidade: 3 * 60 * 1000, // 3 minutos
	tempoParaExpirarSessao: 30 * 60 * 1000, // 30 minutos
	tempoParaLembrarMe: 30 * 24 * 60 * 60 * 1000, // 30 dias
	
	carregarCookiesPrincipais: (function(configuracao) {
		if (!validacao.jsonVazioOuNulo(configuracao)) {
			var date = new Date();
			var lembreMe = '';
			
			if (!validacao.dadoVazioOuNulo(configuracao.lembreMe) || configuracao.lembreMe) {
				date.setTime(date.getTime() + manipulandocookies.tempoParaLembrarMe); // 30 dias
				lembreMe = datas.formatar({'yyyymmddhhmmss': date});
			} else {
				date.setTime(date.getTime() + manipulandocookies.tempoParaExpirarSessao); // 30 minutos
				lembreMe = datas.formatar({'yyyymmddhhmmss': date});
			}
			
			$.cookie('lembreMe', lembreMe, { expires: date, path: '/' });
			$.cookie('arqcorpsessionid', configuracao.cookie.arqcorpsessionid, { expires: date, path: '/' });
		} else {
			var arqcorpsessionid = $.cookie('arqcorpsessionid');
			var lembreMe = $.cookie('lembreMe');
			
			var hoje = new Date();
			hoje.setTime(hoje.getTime() + manipulandocookies.tempoParaExpirarSessao); // + 30 minutos
			var expirarSessaoEm = datas.formatar({'yyyymmddhhmmss': hoje});
			var expirarSessaoEmI = manipulacao.transformarEmNumero(expirarSessaoEm);
			
			var lembreMeI = manipulacao.transformarEmNumero(lembreMe);
			if (lembreMeI < expirarSessaoEmI) {
				var date = new Date();
				date.setTime(date.getTime() + manipulandocookies.tempoParaExpirarSessao); // + 30 minutos
				var lembreMe = datas.formatar({'yyyymmddhhmmss': date});
				
				$.cookie('lembreMe', lembreMe, { expires: date, path: '/' });
				$.cookie('arqcorpsessionid', arqcorpsessionid, { expires: date, path: '/' });
			} else {
				var date = datas.criarData({'yyyymmddhhmmss': lembreMe});
				$.cookie('lembreMe', lembreMe, { expires: date, path: '/' });
				$.cookie('arqcorpsessionid', arqcorpsessionid, { expires: date, path: '/' });
			}
		}
	}),
	
	criar: (function(configuracao) {
		if (validacao.booleanChecado(configuracao.expirar)) {
			if (!validacao.dadoVazioOuNulo(configuracao.minutos)) {
				var date = new Date();
				date.setTime(date.getTime() + (configuracao.minutos * 60 * 1000));
				$.cookie(configuracao.nome, configuracao.valor, { expires: date, path: '/' });
			} else if (!validacao.dadoVazioOuNulo(configuracao.horas)) {
				var date = new Date();
				date.setTime(date.getTime() + (configuracao.horas * 60 * 60 * 1000));
				$.cookie(configuracao.nome, configuracao.valor, { expires: date, path: '/' });
			} else {
				var date = new Date();
				date.setTime(date.getTime() + manipulandocookies.tempoParaExpirarFuncionalidade);
				$.cookie(configuracao.nome, configuracao.valor, { expires: date, path: '/' });
			}
		} else {
			$.cookie(configuracao.nome, configuracao.valor, { path: '/' });
		}
	}),
	
	pegar: (function(nome) {
		return $.cookie(nome);
	}),
	
	alertarRequisicoesSimultaneas: (function() {
		alerta.mostrarPopUpDeErro('Voc\u00ea n\u00e3o pode efetuar est\u00e1 a\u00e7\u00e3o simultaneamente, aguarde alguns instantes entre um evento e outro.');
	}),
};

var validacao = {
		
	alterarDadoNulo: (function (valor) {
		if (valor == null || valor == 'null') {
			valor = '';
		}
		return valor;
	}),
	
	alterarDadoNuloNumerico: (function (valor) {
		if (valor == null || valor == 'null') {
			valor = 0;
		}
		return valor;
	}),
	
	/**
	 * valida se o dado esta' vazio ou nulo
	 * @param dado que sera verificado se esta vazio ou nulo
	 */
	dadoVazioOuNulo: (function(dado) {
		// return dado == '' || dado == 'null' || dado == 'undefined' || dado == undefined || dado == null || typeof(dado) == 'undefined' || jQuery.isEmptyObject(dado);
		return dado == '' || dado == 'null' || dado == 'undefined' || dado == undefined || dado == null || typeof(dado) == 'undefined';
	}),
	
	/**
	 * valida se o json esta' vazio ou nulo
	 * @param json que sera verificado se esta vazio ou nulo
	 */
	jsonVazioOuNulo: (function(json) {
		return jQuery.isEmptyObject(json);
	}),
	
	numeroZerado: (function(dado) {
		return this.dadoVazioOuNulo(dado) || dado == 0 || dado == 0.0 || dado == 0.00 || dado == '0' || dado == '0.0' || dado == '0.00' || dado == '0,0' || dado == '0,00';
	}),
	
	numeroInteiro: (function(dado) {
	    return Number(dado) === dado && dado % 1 === 0;
	}),
	
	numeroFlutuante: (function(dado){
	    return Number(dado) === dado && dado % 1 !== 0;
	}),
	
	/**
	 * tira o espaço do campo que esta' com espaço
	 * @param dado servira' para tirar espaços.
	 */
	dadoSemEspaco: (function(dado) {
		var retorno = true;
		if (dado === manipulacao.normalizar(dado, false)) {
			retorno = false;
		}
		return retorno;
	}),
	
	/**
	 * valida se o combobox esta' vazio ou nulo
	 * @param dado que sera verificado se esta vazio ou nulo
	 */
	comboboxVazioOuNulo: (function(dado) {
		return this.dadoVazioOuNulo(dado) || dado == global.select.semselecao.mensagem;
	}),
	
	/**
	 * valida se o campo moeda esta' vazio ou nulo
	 * @param dado que sera verificado se esta vazio ou nulo
	 */
	dadoMoedaVazioOuNulo: (function(dado) {
		return validacao.dadoVazioOuNulo(dado) || dado == '0,00';
	}),
	
	/**
	 * valida se o e-mail e' valido
	 * @param true/false
	 */
	emailValido: (function(email) {
		if (this.dadoVazioOuNulo(email)) {
			return false;
		}
		
		if (!email.match(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/)) {
			return false;
		}
		
		if (email.indexOf(' ') != -1 || email.indexOf('..') != -1) {
			return false;
		}
		
		return true;
	}),
	
	/**
	 * valida se o ean e' valido
	 * @param codigoDeBarras
	 */
	eanValido:(function(codigoDeBarras) {
		if (!this.dadoVazioOuNulo(codigoDeBarras) && (codigoDeBarras.length == 8 || codigoDeBarras.length == 12 || codigoDeBarras.length == 13 || codigoDeBarras.length == 14)) {
			var factor = 3;
			var sum = 0;

			for (var index = codigoDeBarras.length - 1; index > 0; --index) {
				var mult = manipulacao.transformarEmNumero(codigoDeBarras.substring(index - 1, index));
				sum = sum + mult * factor;
				factor = 4 - factor;
			}

			var cc = ((1000 - sum) % 10);
			var ca = manipulacao.transformarEmNumero(codigoDeBarras.substring(codigoDeBarras.length - 1));

			if (cc == ca) {
				return true;
			}
		}

		return false;
	}),
	
	/**
	 * valida se o valor monetario e' valido
	 * @param true/false
	 */
	valorMonetarioValido: (function(valor) {
		if (validacao.dadoVazioOuNulo(valor)) {
			return false;
		} else {
			var v = valor.replace('.', '').replace(',', '');
			
			if (isNaN(v)) {
				return false;
			}
		}
		
		var valid = /\$?\d{1,3}(.?\d{3})*(\,\d{2})?/.test(valor);
		return valid;
	}),

	/**
	 * valida se a URL e' valido
	 * @param dado que sera verificado se e' valido
	 */
	urlValida: (function(url) {
		if (this.dadoVazioOuNulo(url)) {
			return false;
		}
		
		var regex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
		return regex.test(url);
	}),
	
	htmlValida: (function(texto) {
		if (this.dadoVazioOuNulo(texto)) {
			return false;
		}
		
		var regex = /<[a-z][\s\S]*>/i;
		return regex.test(texto);
	}),
	
	booleanChecado: (function(valor) {
		return !this.dadoVazioOuNulo(valor + '') && (valor == true || valor == 'true');
	}),

	contemApenasNumeros: (function (valor) {
		if (this.dadoVazioOuNulo(valor)) {
			return false;
		} else {
			var regex = /^[0-9]+$/;
			return regex.test(valor.toString());
		}
	}),
	
	/**
	 * valida se o cnpj e' valido
	 * @param true/false
	 */
	cnpjValido : (function(cnpj) {
		cnpj = cnpj.replace(/[^\d]+/g, '');
		if (this.dadoVazioOuNulo(cnpj)) {
			return false;
		}
		
		if (cnpj.length < 14) {
			cnpj = manipulacao.adicionarStringAesquerda(cnpj, '0', 14);
		} else if (cnpj.length != 14) {
			return false;
		}

		// elimina CNPJs inválidos conhecidos
		if (cnpj == '00000000000000' || cnpj == '11111111111111' || cnpj == '22222222222222' || cnpj == '33333333333333' || cnpj == '44444444444444' || cnpj == '55555555555555' || cnpj == '66666666666666' || cnpj == '77777777777777' || cnpj == '88888888888888' || cnpj == '99999999999999') {
			return false;
		}

		// valida DVs
		tamanho = cnpj.length - 2;
		numeros = cnpj.substring(0, tamanho);
		digitos = cnpj.substring(tamanho);
		soma = 0;
		pos = tamanho - 7;
		for (var i = tamanho; i >= 1; i--) {
			soma += numeros.charAt(tamanho - i) * pos--;
			if (pos < 2) {
				pos = 9;
			}
		}

		resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
		if (resultado != digitos.charAt(0)) {
			return false;
		}

		tamanho = tamanho + 1;
		numeros = cnpj.substring(0, tamanho);
		soma = 0;
		pos = tamanho - 7;
		for (i = tamanho; i >= 1; i--) {
			soma += numeros.charAt(tamanho - i) * pos--;
			if (pos < 2) {
				pos = 9;
			}
		}
		resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
		if (resultado != digitos.charAt(1)) {
			return false;
		}

		return true;
	}),

	cpfValido : (function(cpf) {
		cpf = cpf.replace(/[^\d]+/g, '');
		if (this.dadoVazioOuNulo(cpf)) {
			return false;
		}

		// elimina CPFs inválidos conhecidos
		if (cpf.length != 11 || cpf == '00000000000' || cpf == '11111111111' || cpf == '22222222222' || cpf == '33333333333' || cpf == '44444444444' || cpf == '55555555555' || cpf == '66666666666' || cpf == '77777777777' || cpf == '88888888888' || cpf == '99999999999') {
			return false;
		}

		// valida primeiro dígito
		add = 0;
		for (var i = 0; i < 9; i++) {
			add += parseInt(cpf.charAt(i)) * (10 - i);
		}
		
		rev = 11 - (add % 11);
		if (rev == 10 || rev == 11) {
			rev = 0;
		}
		if (rev != parseInt(cpf.charAt(9))) {
			return false;
		}

		// valida segundo dígito
		add = 0;
		for (i = 0; i < 10; i++) {
			add += parseInt(cpf.charAt(i)) * (11 - i);
		}
		rev = 11 - (add % 11);
		if (rev == 10 || rev == 11) {
			rev = 0;
		}
		if (rev != parseInt(cpf.charAt(10))) {
			return false;
		}
		return true;
	}),
	
	skuValido: (function(dado) {
		return dado.match(/(^[A-Za-z0-9_-]+)$/);
	}),
	
	jsonValido: (function(json) {
		if (typeof json == 'object') { 
			try {
				json = JSON.stringify(json);
			} catch(error) {
				return false;
			}
		} else {
			return false;
		}

		if (typeof json == 'string') {
			try {
				json = JSON.parse(json);
			} catch (error) {
				return false;
			}
		}

		return true;
	}),
	
	alfanumericoValido: (function(dado) {
		return dado.match(/(^[A-Za-z0-9]+)$/);
	}),
	
	alfanumericoMaiusculoValido: (function(dado) {
		return dado.match(/(^[A-Z0-9]+)$/);
	}),
	
	letrasMinusculasValido: (function(dado) {
		return dado.match(/(^[a-z]+)$/);
	}),
	
	letrasMaiusculasValido: (function(dado) {
		return dado.match(/(^[A-Z]+)$/);
	}),
	
	numeroValido: (function(dado) {
		return dado.match(/(^[0-9]+)$/);
	}),
	
	manterNoCampoApenasNumeros: (function(campo) {
		$(document).on('keydown', campo, function(e) {
			var key = e.charCode || e.keyCode || 0;
		    return (key == 8 || key == 9 || key == 46 || key == 110 || key == 190 || (key >= 35 && key <= 40) || (key >= 48 && key <= 57) || (key >= 96 && key <= 105));
		});
	})
};

var datas = {
	unidades: {minute: 60000, hour: 3600000, day: 86400000, month: 2592000000, year: 31536000000},
	padroes: ({br_s_h: 'dd/mm/yyyy', br_c_h: 'dd/mm/yyyy hh:mm:ss'}),
	
	hoje: (function(formato) {
		var date = new Date();
		var s = date.toISOString().split('T');
		var d = s[0].split('-');
		
		var day = d[2];
		if (formato == 'ddmmyyyy') {
			return day + '' + d[1] + '' + d[0];
		} else if (formato == 'mmddyyyy') {
			return d[1] + '' + day + '' + d[0];
		} else if (formato == 'yyyymmdd') {
			return d[0] + '' + d[1] + '' + day;
		} else if (formato == 'yyyymmddhhmmss') {
			var h = s[1].split('.')[0].split(':');
			return d[0] + '' + d[1] + '' + day + '' + h[0] + '' + h[1] + '' + h[2];
		} else if (formato == 'dd/mm/yyyy') {
			return day + '/' + d[1] + '/' + d[0];
		} else if (formato == 'dd/mm/yyyy hh:mm:ss') {
			return day + '/' + d[1] + '/' + d[0] + ' ' + s[1].split('.')[0];
		} else if (formato == 'mm/dd/yyyy') {
			return d[1] + '/' + day + '/' + d[0];
		} else if (formato == 'yyyy/mm/dd') {
			return d[0] + '/' + d[1] + '/' + day;
		}else if (formato == 'yyyy-mm-dd') {
			return d[0] + '-' + d[1] + '-' + day;	
		} else if (formato == 'yyyy/mm/dd hh:mm:ss') {
			return d[0] + '/' + d[1] + '/' + day + ' ' + s[1].split('.')[0];
		} else {
			return day + '/' + d[1] + '/' + d[0]; // default
		}
	}),
	
	criar: (function(data) {
		if (!validacao.dadoVazioOuNulo(data) && !isNaN(data.year) && !isNaN(data.month) && !isNaN(data.day) && !isNaN(data.hour) && !isNaN(data.minute) && !isNaN(data.second) && !isNaN(data.millisecond)) {
			return new Date(data.year, data.month, data.day, data.hour, data.minute, data.second, data.millisecond);
		} else if (!validacao.dadoVazioOuNulo(data) && !isNaN(data.year) && !isNaN(data.month) && !isNaN(data.day) && !isNaN(data.hour) && !isNaN(data.minute) && !isNaN(data.second)) {
			return new Date(data.year, data.month, data.day, data.hour, data.minute, data.second);
		} else if (!validacao.dadoVazioOuNulo(data) && !isNaN(data.year) && !isNaN(data.month) && !isNaN(data.day)) {
			return new Date(data.year, data.month, data.day);
		} else if (!validacao.dadoVazioOuNulo(data) && !isNaN(data.timestamp)) {
			return new Date(data.timestamp);
		} else {
			return new Date();
		}
	}),
	
	copiar: (function(date) {
		return new Date(date);
	}),
	
	criarFormatado: (function(configuracao) {
		var d = datas.criar(configuracao.data);
		var f = {};
		f[configuracao.formato] = d;
		return datas.formatar(f);
	}),
	
	criarData: (function(configuracao) {
		var data = datas.pegarData(configuracao);
		return new Date(data.year, data.month, data.day, data.hour, data.minute, data.second, data.millisecond);
	}),
	
	formatar: (function(configuracao) {
		var date = '';
		if (configuracao['ss']) {
			date = configuracao['ss'];
		} else if (configuracao['mm']) {
			date = configuracao['mm'];
		} else if (configuracao['hh']) {
			date = configuracao['hh'];
		} else if (configuracao['dd']) {
			date = configuracao['dd'];
		} else if (configuracao['MM']) {
			date = configuracao['MM'];
		} else if (configuracao['yyyy']) {
			date = configuracao['yyyy'];
		} else if (configuracao['hh:mm']) {
			date = configuracao['hh:mm'];
		} else if (configuracao['hh:mm:ss']) {
			date = configuracao['hh:mm:ss'];
		} else if (configuracao['ddmmyyyy']) {
			date = configuracao['ddmmyyyy'];
		} else if (configuracao['mmddyyyy']) {
			date = configuracao['mmddyyyy'];
		} else if (configuracao['yyyymmdd']) {
			date = configuracao['yyyymmdd'];
		} else if (configuracao['yyyymmddhhmmss']) {
			date = configuracao['yyyymmddhhmmss'];
		} else if (configuracao['dd/mm/yyyy']) {
			date = configuracao['dd/mm/yyyy'];
		} else if (configuracao['d/m/yyyy']) {
			date = configuracao['d/m/yyyy'];
		} else if (configuracao['dd/mm/yyyy hh:mm:ss']) {
			date = configuracao['dd/mm/yyyy hh:mm:ss'];
		} else if (configuracao['dd/mm/yyyy hh:mm']) {
			date = configuracao['dd/mm/yyyy hh:mm'];
		} else if (configuracao['mm/dd/yyyy']) {
			date = configuracao['mm/dd/yyyy'];
		} else if (configuracao['mm/dd/yyyy hh:mm:ss']) {
			date = configuracao['mm/dd/yyyy hh:mm:ss'];
		} else if (configuracao['yyyy/mm/dd']) {
			date = configuracao['yyyy/mm/dd'];
		} else if (configuracao['yyyy-mm-dd']) {
			date = configuracao['yyyy-mm-dd'];
		} else if (configuracao['yyyy-mm-dd hh:mm']) {
			date = configuracao['yyyy-mm-dd hh:mm'];
		} else if (configuracao['yyyy-mm-dd hh:mm:ss']) {
			date = configuracao['yyyy-mm-dd hh:mm:ss'];
		}
		
		var year = date.getFullYear();
		
		var month = (date.getMonth() + 1);
		if (month < 10) {
			month = '0' + month;
		}
		
		var day = date.getDate();
		if (day < 10) {
			day = '0' + day;
		}
		
		var hour = date.getHours();
		if (hour < 10) {
			hour = '0' + hour;
		}
		
		var minute = date.getMinutes();
		if (minute < 10) {
			minute = '0' + minute;
		}
		
		var second = date.getSeconds();
		if (second < 10) {
			second = '0' + second;
		}
		
		if (configuracao['ss']) {
			return second;
		} else if (configuracao['mm']) {
			return minute;
		} else if (configuracao['hh']) {
			return hour;
		} else if (configuracao['dd']) {
			return day;
		} else if (configuracao['MM']) {
			return month;
		} else if (configuracao['yyyy']) {
			return year;
		} else if (configuracao['hh:mm']) {
			return hour + ':' + minute;
		} else if (configuracao['hh:mm:ss']) {
			return hour + ':' + minute + ':' + second;
		} else if (configuracao['ddmmyyyy']) {
			return day + '' + month + '' + year;
		} else if (configuracao['mmddyyyy']) {
			return month + '' + day + '' + year;
		} else if (configuracao['yyyymmdd']) {
			return year + '' + month + '' + day;
		} else if (configuracao['yyyymmddhhmmss']) {
			return year + '' + month + '' + day + '' + hour + '' + minute + '' + second;
		} else if (configuracao['dd/mm/yyyy']) {
			return day + '/' + month + '/' + year;
		} else if (configuracao['d/m/yyyy']) {
			return day + '/' + month + '/' + year;
		} else if (configuracao['dd/mm/yyyy hh:mm:ss']) {
			return day + '/' + month + '/' + year + ' ' + hour + ':' + minute + ':' + second;
		} else if (configuracao['mm/dd/yyyy']) {
			return month + '/' + day + '/' + year;
		} else if (configuracao['mm/dd/yyyy hh:mm:ss']) {
			return month + '/' + day + '/' + year + ' ' + hour + ':' + minute + ':' + second;
		} else if (configuracao['yyyy/mm/dd']) {
			return year + '/' + month + '/' + day;
		} else if (configuracao['yyyy-mm-dd']) {
			return year + '-' + month + '-' + day;
		} else if (configuracao['yyyy-mm-yyyy hh:mm']) {
			return year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
		} else if (configuracao['yyyy-mm-yyyy hh:mm:ss']) {
			return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
		} else {
			return '';
		}
	}),
	
	pegarData: (function(configuracao) {
		var i = {};
		if (configuracao['hh']) {
			var data = configuracao['hh'];
			
			if (validacao.dadoVazioOuNulo(data)) {
				return {};
			}
			
			i.day = '01';
			i.month = '01';
			i.year = '0001';
			i.hour = data[0];
			i.minute = '00';
			i.second = '00';
			i.millisecond = '0000';
		} else if (configuracao['hh:mm']) {
			var data = configuracao['hh:mm'].split(':');
			
			if (validacao.dadoVazioOuNulo(data)) {
				return {};
			}
			
			i.day = '01';
			i.month = '01';
			i.year = '0001';
			i.hour = data[0];
			i.minute = data[1];
			i.second = '00';
			i.millisecond = '0000';
		} else if (configuracao['hh:mm:ss']) {
			var data = configuracao['hh:mm:ss'].split(':');
			
			if (validacao.dadoVazioOuNulo(data)) {
				return {};
			}
			
			i.day = '01';
			i.month = '01';
			i.year = '0001';
			i.hour = data[0];
			i.minute = data[1];
			i.second = data[2];
			i.millisecond = '0000';
		} else if (configuracao['dd/mm/yy']) {
			var data = configuracao['dd/mm/yy'].split('/');
			
			if (validacao.dadoVazioOuNulo(data)) {
				return {};
			}
			
			i.day = data[0];
			i.month = data[1];
			i.year = '20' + data[2];
		} else if (configuracao['d/m/yy']) {
			var data = configuracao['d/m/yy'].split('/');
			
			if (validacao.dadoVazioOuNulo(data)) {
				return {};
			}
			
			i.day = data[0];
			i.month = data[1];
			i.year = '20' + data[2];
		} else if (configuracao['dd/mm/yyyy']) {
			var data = configuracao['dd/mm/yyyy'].split('/');
			
			if (validacao.dadoVazioOuNulo(data)) {
				return {};
			}
			
			i.day = data[0];
			i.month = data[1];
			i.year = data[2];
		} else if (configuracao['dd/mm/yyyy hh:mm:ss']) {
			var data = configuracao['dd/mm/yyyy hh:mm:ss'];
			
			if (validacao.dadoVazioOuNulo(data)) {
				return {};
			}
			
			i.day = data.substring(0, 2);
			i.month = data.substring(3, 5);
			i.year = data.substring(6, 10);
			i.hour = data.substring(11, 13);
			i.minute = data.substring(14, 16);
			i.second = data.substring(17);
			i.millisecond = '0000';
		} else if (configuracao['dd/mm/yyyy hh:mm']) {
			var data = configuracao['dd/mm/yyyy hh:mm'];
			
			if (validacao.dadoVazioOuNulo(data)) {
				return {};
			}
			
			i.day = data.substring(0, 2);
			i.month = data.substring(3, 5);
			i.year = data.substring(6, 10);
			i.hour = data.substring(11, 13);
			i.minute = data.substring(14, 16);
			i.second = '00';
			i.millisecond = '0000';
		} else if (configuracao['mm/dd/yy']) {
			var data = configuracao['mm/dd/yy'].split('/');
			
			if (validacao.dadoVazioOuNulo(data)) {
				return {};
			}
			
			i.month = data[0];
			i.day = data[1];
			i.year = '20' + data[2];
		} else if (configuracao['mm/dd/yyyy']) {
			var data = configuracao['mm/dd/yyyy'].split('/');
			
			if (validacao.dadoVazioOuNulo(data)) {
				return {};
			}
			
			i.month = data[0];
			i.day = data[1];
			i.year = data[2];
		} else if (configuracao['yyyy/mm/dd']) {
			var data = configuracao['yyyy/mm/dd'].split('/');
			
			if (validacao.dadoVazioOuNulo(data)) {
				return {};
			}
			
			i.year = data[0];
			i.month = data[1];
			i.day = data[2];
		} else if (configuracao['yyyymmdd']) {
			var data = configuracao['yyyymmdd'] + '';
			i.year = data.substring(0, 4);
			i.month = data.substring(4, 6);
			i.day = data.substring(6);
		} else if (configuracao['yyyymmddhhmmss']) {
			var data = configuracao['yyyymmddhhmmss'] + '';
			i.year = data.substring(0, 4);
			i.month = data.substring(4, 6);
			i.day = data.substring(6, 8);
			i.hour = data.substring(8, 10);
			i.minute = data.substring(10, 12);
			i.second = data.substring(12);
		} else if (configuracao['yyyy-mm-dd']) {
			var data = configuracao['yyyy-mm-dd'];
			
			if (validacao.dadoVazioOuNulo(data)) {
				return {};
			}
			
			i.year = data.substring(0, 4);
			i.month = data.substring(5, 7);
			i.day = data.substring(8, 10);
			i.hour = '00';
			i.minute = '00';
			i.second = '00';
			i.millisecond = '0000';
		} else if (configuracao['yyyy-mm-dd hh:mm']) {
			var data = configuracao['yyyy-mm-dd hh:mm'];
			
			if (validacao.dadoVazioOuNulo(data)) {
				return {};
			}
			
			i.year = data.substring(0, 4);
			i.month = data.substring(5, 7);
			i.day = data.substring(8, 10);
			i.hour = data.substring(11, 13);
			i.minute = '00';
			i.second = '00';
			i.millisecond = '0000';
		} else if (configuracao['yyyy-mm-dd hh:mm:ss']) {
			var data = configuracao['yyyy-mm-dd hh:mm:ss'];
			
			if (validacao.dadoVazioOuNulo(data)) {
				return {};
			}
			
			i.year = data.substring(0, 4);
			i.month = data.substring(5, 7);
			i.day = data.substring(8, 10);
			i.hour = data.substring(11, 13);
			i.minute = data.substring(14, 16);
			i.second = data.substring(17);
		}
		
		return {
			day: parseInt(i.day, 10),
			month: parseInt(i.month, 10) - 1,
			year: parseInt(i.year, 10),
			hour: parseInt((i.hour == undefined ? 0 : i.hour), 10),
			minute: parseInt((i.minute == undefined ? 0 : i.minute), 10),
			second: parseInt((i.second == undefined ? 0 : i.second), 10),
			millisecond: parseInt((i.millisecond == undefined ? 0 : i.millisecond), 10)
		};
	}),
	
	/**
	 * @param: {
	 * 	data: <data para converter em qualquer formato>,
	 * 	formato: <formato que deseja converter>
	 * }
	 */
	converterFormato: (function(configuracao) {
		if (configuracao.data['sem-formato']) {
			formato = datas.pegarFormato({'data': configuracao.data['sem-formato'], 'padrao': configuracao.padrao});
			configuracao['data'][formato] = configuracao.data['sem-formato'];
		}
		
		var data = datas.pegarData(configuracao.data);
		configuracao['data'] = data;
		return datas.criarFormatado(configuracao);
	}),
	
	pegarFormato: (function(configuracao) {
		var data = configuracao.data;
		
		if (validacao.dadoVazioOuNulo(data)) {
			return null;
		}
		
		if (data.length <= 5) {
			if (data.indexOf(':') < 0) {
				return null;
		    } else {
		    	var formato = data.split(':');
		    	
		    	if (formato.length == 3) {
		    		return 'hh:mm:ss';
		    	} else if (formato.length == 2) {
		    		return 'hh:mm';
		    	} else {
		    		return null;
		    	}
		    }
		} else if (data.length == 6) {
			var formato = data.split('/');
			
			if (formato[2].length == 2) {
				// exemplo possivel: 1/1/18
				if (configuracao.padrao == 'BR') {
					return 'dd/mm/yy';
				} else {
					return 'mm/dd/yy';
				}
			} else if (formato[0].length == 2) {
				// exemplo possivel: 18/1/1
				return 'yy/mm/dd';
			} else {
				if (manipulacao.transformarEmNumero(formato[0]) > 31) {
					// exemplo possivel: 98/1/1
					return 'yy/mm/dd';
				} else if (manipulacao.transformarEmNumero(formato[2]) > 31) {
					// exemplo possivel: 1/1/98
					if (configuracao.padrao == 'BR') {
						return 'dd/mm/yy';
					} else {
						return 'mm/dd/yy';
					}
				} else if (manipulacao.transformarEmNumero(formato[0]) == 0) {
					// exemplo possivel: 00/1/1
					return 'yy/mm/dd';
				} else if (manipulacao.transformarEmNumero(formato[2]) == 0) {
					// exemplo possivel: 1/1/00
					if (configuracao.padrao == 'BR') {
						return 'dd/mm/yy';
					} else {
						return 'mm/dd/yy';
					}
				} else {
					return null;
				}
			}
		} else if (data.length == 8) {
			if (data.indexOf(':') < 0) {
				var formato = data.split('/');
				
				if (formato[2].length == 4) {
					// exemplo possivel: 1/1/2018
					if (configuracao.padrao == 'BR') {
						return 'dd/mm/yyyy';
					} else {
						return 'mm/dd/yyyy';
					}
				} else if (formato[0].length == 4) {
					// exemplo possivel: 2018/1/1
					return 'yyyy/mm/dd';
				} else {
					if (manipulacao.transformarEmNumero(formato[0]) > 31) {
						// exemplo possivel: 98/01/01
						return 'yyyy/mm/dd';
					} else if (manipulacao.transformarEmNumero(formato[2]) > 31) {
						// exemplo possivel: 01/01/98
						if (configuracao.padrao == 'BR') {
							return 'dd/mm/yyyy';
						} else {
							return 'mm/dd/yyyy';
						}
					} else if (manipulacao.transformarEmNumero(formato[0]) == 0) {
						// exemplo possivel: 00/01/01
						return 'yyyy/mm/dd';
					} else if (manipulacao.transformarEmNumero(formato[2]) == 0) {
						// exemplo possivel: 01/01/00
						if (configuracao.padrao == 'BR') {
							return 'dd/mm/yyyy';
						} else {
							return 'mm/dd/yyyy';
						}
					} else {
						return null;
					}
				}
		    } else {
		    	var formato = data.split(':');
		    	
		    	if (formato.length == 3) {
		    		return 'hh:mm:ss';
		    	} else if (formato.length == 2) {
		    		return 'hh:mm';
		    	} else {
		    		return null;
		    	}
		    }
		} else if (data.length == 10) {
			var formato = data.split('/');
			
			if (formato[2].length == 4) {
				// exemplo possivel: 01/01/2018
				if (configuracao.padrao == 'BR') {
					return 'dd/mm/yyyy';
				} else {
					return 'mm/dd/yyyy';
				}
			} else if (formato[0].length == 4) {
				// exemplo possivel: 2018/01/01
				return 'yyyy/mm/dd';
			} else {
				return null;
			}
		}
	}),
	
	diaZERO: (function(date) {
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);
		return date;
	}),
	
	diferenca: (function (d) {
		var d1 = datas.copiar(d.referencia);
		var d2 = datas.copiar(d.diferenca);
		
		if (d.unit != 'hour' && d.unit != 'minute' && d.unit != 'second') {
			d1 = datas.diaZERO(d1);
			d2 = datas.diaZERO(d2);
		}
		
		var diferenca = d1.getTime() - d2.getTime();
		
		if (diferenca === 0) {
			return 0;	
		}
		
		return Math.round(diferenca / datas.unidades[d.unidade]);
	}),
	
	diferencaDeSegundos: (function (d1, d2) {
		return datas.diferenca({referencia: d1, diferenca: d2, unidade: 'second'});				
	}),
	
	diferencaDeMinutos: (function (d1, d2) {
		return datas.diferenca({referencia: d1, diferenca: d2, unidade: 'minute'});				
	}),
	
	diferencaDeHoras: (function (d1, d2) {
		return datas.diferenca({referencia: d1, diferenca: d2, unidade: 'hour'});				
	}),
	
	diferencaDeDias: (function (d1, d2) {
		return datas.diferenca({referencia: d1, diferenca: d2, unidade: 'day'});				
	}),
	
	diferencaDeMeses: (function (d1, d2) {
		return datas.diferenca({referencia: d1, diferenca: d2, unidade: 'month'});				
	}),
	
	diferencaDeAnos: (function (d1, d2) {
		return datas.diferenca({referencia: d1, diferenca: d2, unidade: 'year'});				
	}),
	
	dataValida: (function(data) {
	    if (!/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(data)) {
	    	return false;
	    }

	    var partes = data.split('/');
	    var dia = parseInt(partes[0], 10);
	    var mes = parseInt(partes[1], 10);
	    var ano = parseInt(partes[2], 10);
	    
	    if (ano < 100) {
	    	ano = ano + 2000;
	    }

	    if (ano < 1000 || ano > 3000 || mes == 0 || mes > 12) {
	    	return false;
	    }

	    var meses = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

	    if (ano % 400 == 0 || (ano % 100 != 0 && ano % 4 == 0)) {
	    	meses[1] = 29;
	    }
	    
	    return dia > 0 && dia <= meses[mes - 1];
	}),
	
	horaValida: (function(hora) {
		if (hora.indexOf(':') < 0) {
	        return false;
	    }
		
		var partes = hora.split(':');
		
		var sHor = partes[0];
	    if (validacao.dadoVazioOuNulo(manipulacao.trim(sHor)) || isNaN(sHor) || parseInt(sHor) > 23) {
            return false;
	    }
	    
	    var sMin = partes[1];
        if (validacao.dadoVazioOuNulo(manipulacao.trim(sMin)) || isNaN(sMin) || parseInt(sMin) > 59) {
            return false;
        }
        
        if (partes.length == 3) {
        	var sSeg = partes[2];
        	
        	if (validacao.dadoVazioOuNulo(manipulacao.trim(sSeg)) || isNaN(sSeg) || parseInt(sSeg) > 59) {
        		return false;
        	}
        }
        
        return true;
	})
};


var manipulacao = {
		
	planilha: {
		normalizarString: (function(colunas, posicao, removerEspacos) {
			var valor = colunas[posicao];
			if (!validacao.dadoVazioOuNulo(valor)) {
				if (validacao.booleanChecado(removerEspacos)) {
					return manipulacao.replaceAll(manipulacao.trim(valor), '"', '');
				} else {
					return manipulacao.replaceAll(valor, '"', '');
				}
			} else {
				return null;
			}
		}),
		
		transformarEmNumero: (function(valor) {
			if (validacao.dadoVazioOuNulo(valor) || typeof(valor) == "undefined") {
				return parseFloat('0');
			}
			if (isNaN(valor)) {
				var v = valor.toString().replace(/\,/g,'');
				return parseFloat(v);
			} else {
				return parseFloat(valor);
			}
		}), 
	},
	
	calcularPorcentagem: (function(quantidade, total) {
		if (total == 0) {
			return 0;
		}
		
		return manipulacao.arredondar((100 * quantidade) / total, 2);
	}),
	
	porcentagemValida: (function(campo, nome) {
		var $campo = $('#' + campo);
		
		alerta.removerAlertaDeErroDoCampo($campo);
		
		if (manipulacao.transformarEmNumero($campo.val()) > 100) {
			alerta.adiconarAlertaDeErroNoCampo($campo, 'Favor informar um valor de ' + nome + ' menor que 100%.');
			return false;
		} else {
			return true;
		}
	}),
	
	/**
	 * arredondar um numero
	 */
	arredondar: (function(valor, decimal) {
		if (validacao.dadoVazioOuNulo(valor)) {
			return 0;
		} else {
			if (validacao.dadoVazioOuNulo(decimal)) {
				return valor.toFixed(2);
			} else {
				return valor.toFixed(decimal);
			}
		}
	}), 
	
	/**
	 * transformar o dado
	 * 
	 * @param valor : valor transformacao
	 * @returns {String} : valor transformacao
	 */
	transformarEmString: (function(valor) {
		if (validacao.dadoVazioOuNulo(valor)) {
			return '';
		} else {
			return valor.toString();
		}
	}),
	
	substituirQuebraDeLinha: (function(texto) {
		if (validacao.dadoVazioOuNulo(texto)) {
			return '';
		} else {
			return texto.toString().replace(/(?:\r\n|\r|\n)/g, '<br />');
		}
	}),
	
	/**
	 * transformar uma string numero javascript (inteiro ou float)
	 * 
	 * valor == '' return 0
	 * valor == ' ' return 0
	 * valor == null return 0
	 * valor == 'null' return 0
	 * 
	 * @param valor : valor transformacao
	 * @returns {Float} : valor transformacao
	 */
	transformarEmNumero: (function(valor) {
		if (validacao.dadoVazioOuNulo(valor) || typeof(valor) == "undefined") {
			return parseFloat('0');
		}
		if (isNaN(valor)) {
			var v = valor.toString().replace(/\./g,'');
			v = v.replace(/\,/,'.');
			return parseFloat(v);
		} else {
			return parseFloat(valor);
		}
	}), 
	
	/**
	 * transformar o valor em formato numero javascript (inteiro ou float)
	 * 
	 * @param valor : valor transformacao
	 * @returns {Float} : valor transformacao
	 */
	transformarEmNumerico: (function(valor) {
		if (validacao.dadoVazioOuNulo(valor) || typeof(valor) == "undefined") {
			return parseFloat('0');
		}
		if (isNaN(valor)) {
			var v = valor.toString().replace(/\./g,'');
			v = v.replace(/\,/,'.');
			return parseFloat(v);
		} else {
			return parseFloat(valor);
		}
	}),
	
	/**
	 * transformar o valor em formato monetario, com qualquer quantidade
	 * de casas apos a virgula
	 * 
	 * @param valor : valor para formatacao
	 * @param casasDecimais : quantidade de casas apos a virgula
	 * @returns {String} : valor formatado
	 */
	transformarEmMonetario: (function(valor, casasDecimais) {
		if (casasDecimais === undefined) {
			casasDecimais = 2;
		}
		
		if (validacao.dadoVazioOuNulo(valor)) {
			valor = '0';
		}
		
		var base = Math.pow(10, casasDecimais);
		
		valor = valor.toString().replace(/\$|\,/g,'');
		if (isNaN(valor)) {
			valor = '0';
		}
		
		sign = (valor == (valor = Math.abs(valor)));
		valor = Math.floor(valor * base + 0.50000000001);
		cents = valor % base;
		if (cents < Math.pow(10, (casasDecimais - 1))) {
			cents = cents.toString();
			var zeros = '';
			for (var i = casasDecimais; i > cents.length; i--) {
				zeros += '0';
			}
			cents = zeros + cents;
		}
		
		valor = Math.floor(valor/base).toString();
		for (var i = 0; i < Math.floor((valor.length-(1+i))/3); i++) {
			valor = valor.substring(0, valor.length - (4 * i + 3)) + '.' + valor.substring(valor.length - (4 * i + 3));
		}
		
		return (((sign) ? '' : '-') + valor + ',' + cents);
	}),
	
	/**
	 * transformar o valor em formato monetario adicionando a sigla da moeda
	 * 
	 * @param valor : valor para formatacao
	 * @param moeda : formato da sigla
	 * @returns {String} : valor formatado
	 */
	transformarEmUmTipoMonetario: (function(valor, moeda) {
		if (moeda === undefined) {
			return manipulacao.transformarEmMonetario(valor);
		} else {
			if (moeda == 'BRA' || moeda == 'real') {
				return 'R$ ' + manipulacao.transformarEmMonetario(valor);
			} else if (moeda == 'USA' || moeda == 'dolar-americano') {
				return 'US$ ' + manipulacao.transformarEmMonetario(valor);
			} else if (moeda == 'CAN') {
				return 'C$ ' + manipulacao.transformarEmMonetario(valor);
			} else if (moeda == 'SWI') {
				return 'Fr ' + manipulacao.transformarEmMonetario(valor);
			} else if (moeda == 'AUS') {
				return 'A$ ' + manipulacao.transformarEmMonetario(valor);
			} else if (moeda == 'NZL') {
				return 'NZ$ ' + manipulacao.transformarEmMonetario(valor);
			} else {
				return 'R$ ' + manipulacao.transformarEmMonetario(valor);
			}
		}
	}),
	
	/**
	 * remove espacos em branco da String 
	 * 
	 * @param String : para remocao de espacoes em branco
	 * @returns {String} : sem espacos em branco
	 */
	trim: (function(string) {
		if (validacao.dadoVazioOuNulo(string) || typeof(string) == "undefined") {
			string = '';
		}
		return string.toString().replace(/[' ']/g, '');
	}),
	
	removerEspacos: (function(string) {
		if (validacao.dadoVazioOuNulo(string) || typeof(string) == "undefined") {
			string = '';
		}
		return string.toString().trim();
	}),
	
	/**
	 * remove todos os caracteres especiais da String, mantendo apenas um texto alfanumerico
	 * ou mantem o texto de acordo com regex do parametro
	 * 
	 * @param String : para remocao de caracteres especiais
	 * @param isTemEspacoEmBranco : {
	 * 		true: mantem espacos em branco,
	 * 		false: remove espacos em branco
	 * } 
	 * @returns {String} : normalizada
	 */
	normalizar: (function(string, temEspacoEmBranco, normalizacao) {
		if (validacao.dadoVazioOuNulo(string)) {
	    	return '';
	    }
		
		if (validacao.dadoVazioOuNulo(temEspacoEmBranco)) {
	    	temEspacoEmBranco = false;
	    }
	    
	    var from  = 'áàâãäåæaaaÀÁÂÃÄÅAAAÆccç©CCÇÐÐèéêëeeeeeÈÊËEEEEE€gGiìíîïìiiiÌÍÎÏÌIIIlLnnñNNÑòóôõöðoooøÒÓÔÕÖOOOØŒrŕŕ®RšsßŠSùúûüuuuuÙÚÛÜUUUUýÿýýþÿÝŸžzzŽZZ';
	    var to    = 'aaaaaaaaaaAAAAAAAAAAccccCCCDDeeeeeeeeeEEEEEEEEEgGiiiiiiiiiIIIIIIIIlLnnnNNNooooooooooOOOOOOOOOOrrrrRssSSSuuuuuuuuUUUUUUUUyyyyyyYYzzzZZZ';
	    var regex = /^[0-9a-zA-Z]+$/;
	    if (!validacao.dadoVazioOuNulo(normalizacao)) {
	    	regex = normalizacao;
	    }
	    
	    for (var i = 0, x = from.length; i < x; i++) {
	        char_re = new RegExp(from.charAt(i), 'gim');
	        string = string.replace(char_re, to.charAt(i));
	    }
	    
	    var str = [];
	    for (var i = 0, x = string.length; i < x; i++) {
	        if (string.charAt(i).match(regex) || (string.charAt(i) == ' ' && temEspacoEmBranco)) {
	            str.push(string.charAt(i));
	        }
	    }
	    return str.join('');
	}),
	
	normalizarNumero: (function(numero) {
		var n1 = validacao.alterarDadoNulo(numero) + '';
		var n2 = manipulacao.manterNaStringApenasNumeros(n1);
		return manipulacao.trim(n2);
	}),
	
	replaceAll: (function(texto, textoParaRemover, textoParaInserir) {
		if (validacao.dadoVazioOuNulo(texto)) {
			return '';
		}
		
	    return texto.split(textoParaRemover).join(textoParaInserir);
	}),
	
	manterNaStringApenasLetras: (function(string) {
		return string.replace(/[^a-zA-Z]/g, '');
	}),
	
	manterNaStringApenasLetrasENumeros: (function(string) {
		return string.replace(/[^a-zA-Z 0-9]/g, '');
	}), 
	
	manterNaStringApenasNumeros: (function(string) {
		return string.replace(/[^0-9]/g, '');
	}),
	
	pegarDDDeTelefone: (function(telefone) {
		if (validacao.dadoVazioOuNulo(telefone)) {
			return ['', '', ''];
		} else {
			var dado = manipulacao.normalizarNumero(telefone);
			if (dado.length == 11 || dado.length == 10 || dado.length == 9) { // celular ou telefone
				return [dado.substring(0, 2), dado.substring(2), '55'];
			} else { // qualquer coisa
				return [dado.substring(0, 2), dado.substring(2), ''];
			}
		}
	}),
	
	pegarDDDeFax: (function(fax) {
		return this.pegarDDDeTelefone(fax);
	}),
	
	pegarDDDeCelular: (function(celular) {
		return this.pegarDDDeTelefone(celular);
	}),
	
	primeiraLetraMaiusculo: (function(dado) {
		if (validacao.dadoVazioOuNulo(dado)) {
			return dado;
		} else {
			return dado.substring(0, 1).toUpperCase() + dado.substring(1);
		}
	}),
	
	adicionarStringAesquerda: (function(string, character, size) {
		if (string.length >= size) {
			return string;
		}
		
		character = character || ' ';
		
		return (new Array(Math.ceil((size - string.length) / character.length) + 1).join(character)).substr(0, (size - string.length)) + string;
	})
};

var formatacao = {
	cep: (function(dado) {
		var cep = validacao.alterarDadoNulo(dado) + '';
		if (!validacao.dadoVazioOuNulo(cep)) {
			dado = null; // Memory-Leak prevents!
			var cep_1 = cep.substring(0, 2);
			var cep_2 = cep.substring(2, 5);
			var cep_3 = cep.substring(5);
			cep = cep_1 + '.' + cep_2 + '-' + cep_3;
		}
		return cep;
	}),
	
	place: (function(dado) {
		var placa = validacao.alterarDadoNulo(dado) + '';
		if (!validacao.dadoVazioOuNulo(dado)) {
			value = null; // Memory-Leak prevents!
			var placa_1 = placa.substring(0, 3);
			var placa_2 = placa.substring(3);
			placa = placa_1 + '-' + placa_2;
		}
		return placa;
	}),
	
	cnpj: (function(dado) {
		var cnpj = validacao.alterarDadoNulo(dado) + '';
		if (!validacao.dadoVazioOuNulo(cnpj)) {
			dado = null; // Memory-Leak prevents!
			var cnpj_1 = cnpj.substring(0, 2);
			var cnpj_2 = cnpj.substring(2, 5);
			var cnpj_3 = cnpj.substring(5, 8);
			var cnpj_4 = cnpj.substring(8, 12);
			var cnpj_5 = cnpj.substring(12);
			cnpj = cnpj_1 + '.' + cnpj_2 + '.' + cnpj_3 + '/' + cnpj_4 + '-' + cnpj_5;
		}
		return cnpj;
	}),
	
	cpf: (function(dado) {
		var cpf = validacao.alterarDadoNulo(dado) + '';
		if (!validacao.dadoVazioOuNulo(cpf)) {
			dado = null; // Memory-Leak prevents!
			var cpf_1 = cpf.substring(0, 3);
			var cpf_2 = cpf.substring(3, 6);
			var cpf_3 = cpf.substring(6, 9);
			var cpf_4 = cpf.substring(9);
			cpf = cpf_1 + '.' + cpf_2 + '.' + cpf_3 + '-' + cpf_4;
		}
		return cpf;
	}),
	
	rg: (function(dado) {
		var rg = validacao.alterarDadoNulo(dado) + '';
		if (!validacao.dadoVazioOuNulo(rg)) {
			dado = null; // Memory-Leak prevents!
			var rg_1 = rg.substring(0, 2);
			var rg_2 = rg.substring(2, 5);
			var rg_3 = rg.substring(5, 8);
			var rg_4 = rg.substring(8);
			rg = rg_1 + '.' + rg_2 + '.' + rg_3 + '-' + rg_4;
		}
		return rg;
	}),
	
	inscricaoEstadual: (function(dado) {
		var inscricaoEstadual = validacao.alterarDadoNulo(dado) + '';
		if (!validacao.dadoVazioOuNulo(inscricaoEstadual)) {
			dado = null; // Memory-Leak prevents!
			var inscricaoEstadual_1 = inscricaoEstadual.substring(0, 2);
			var inscricaoEstadual_2 = inscricaoEstadual.substring(2, 5);
			var inscricaoEstadual_3 = inscricaoEstadual.substring(5, 8);
			var inscricaoEstadual_4 = inscricaoEstadual.substring(8);
			inscricaoEstadual = inscricaoEstadual_1 + '.' + inscricaoEstadual_2 + '.' + inscricaoEstadual_3 + '-' + inscricaoEstadual_4;
		}
		return inscricaoEstadual;
	}),
	
	datetimepicker: (function(configuracao) {
		$.datetimepicker.setLocale('pt-BR');
		
		$('#' + configuracao.campo).datetimepicker({
			format : (validacao.dadoVazioOuNulo(configuracao.formato) ? 'd/m/Y H:i' : configuracao.formato),
			lang : (validacao.dadoVazioOuNulo(configuracao.idioma) ? 'pt-BR' : configuracao.idioma),
			theme : (validacao.dadoVazioOuNulo(configuracao.tema) ? '' : configuracao.tema),
			timepicker : (validacao.booleanChecado(configuracao.semHorario) ? false : true)
		});
	}),
	
	cest: (function(dado) {
		var cest = validacao.alterarDadoNulo(dado) + '';
		if (!validacao.dadoVazioOuNulo(cest)) {
			dado = null; // Memory-Leak prevents!
			var cest_1 = cest.substring(0, 2);
			var cest_2 = cest.substring(2, 5);
			var cest_3 = cest.substring(5);
			cest = cest_1 + '.' + cest_2 + '.' + cest_3;
		}
		return cest;
	}),
	
	telefone: (function(telefone, ddd, tipo, local) {
		if (!validacao.dadoVazioOuNulo(telefone) && validacao.dadoVazioOuNulo(ddd)) {
			ddd = telefone.toString().substring(0, 2);
			telefone = telefone.toString().substring(2);
		}
		
		telefone = manipulacao.normalizar(telefone.toString());
		
		if (!validacao.dadoVazioOuNulo(telefone) && !validacao.dadoVazioOuNulo(ddd)) {
			if (!validacao.dadoVazioOuNulo(tipo) && !validacao.dadoVazioOuNulo(local)) {
				return '(' + ddd + ') ' + telefone.toString().substring(0, 4) + '-' + telefone.toString().substring(4) + ' [' + tipo + ' - ' + local + ']';
			} else if (!validacao.dadoVazioOuNulo(tipo)) {
				return '(' + ddd + ') ' + telefone.toString().substring(0, 4) + '-' + telefone.toString().substring(4) + ' [' + tipo + ']';
			} else if (!validacao.dadoVazioOuNulo(local)) {
				return '(' + ddd + ') ' + telefone.toString().substring(0, 4) + '-' + telefone.toString().substring(4) + ' [' + local + ']';
			} else {
				return '(' + ddd + ') ' + telefone.toString().substring(0, 4) + '-' + telefone.toString().substring(4);
			}
		} else {
			return '';
		}
	}),
	
	fax: (function(fax, ddd) {
		return toValidTelefone(fax, ddd);
	}),
	
	celular: (function(celular, ddd, tipo, local) {
		if (!validacao.dadoVazioOuNulo(celular) && validacao.dadoVazioOuNulo(ddd)) {
			ddd = celular.toString().substring(0, 2);
			celular = celular.toString().substring(2);
		}
		
		celular = manipulacao.normalizar(celular.toString());
		
		if (!validacao.dadoVazioOuNulo(celular) && !validacao.dadoVazioOuNulo(ddd)) {
			if (!validacao.dadoVazioOuNulo(tipo) && !validacao.dadoVazioOuNulo(local)) {
				return '(' + ddd + ') ' + celular.toString().substring(0, 5) + '-' + celular.toString().substring(5) + ' [' + tipo + ' - ' + local + ']';
			} else if (!validacao.dadoVazioOuNulo(tipo)) {
				return '(' + ddd + ') ' + celular.toString().substring(0, 5) + '-' + celular.toString().substring(5) + ' [' + tipo + ']';
			} else if (!validacao.dadoVazioOuNulo(local)) {
				return '(' + ddd + ') ' + celular.toString().substring(0, 5) + '-' + celular.toString().substring(5) + ' [' + local + ']';
			} else {
				return '(' + ddd + ') ' + celular.toString().substring(0, 5) + '-' + celular.toString().substring(5);
			}
		} else {
			return '';
		}
	}),
	
	keypress: (function(configuracao) {
		$('#' + configuracao.campo).keypress(function() {
			var limite = 499;
			var informativo = 'caracteres restantes.';
			var caracteresDigitados = $(this).val().length;
	        var caracteresRestantes = limite - caracteresDigitados;
	        
		    if (caracteresRestantes <= 0) {
		    	var comentario = $('#' + configuracao.campo).val();
		        $('#' + configuracao.campo).val(comentario.substr(0, limite));
		        $('.note').empty().append('0 ' + informativo);
		    } else {
		    		$('.note').empty().append('<strong>' + caracteresRestantes + ' ' + informativo + '</strong>');
		    }
		});
	})
};