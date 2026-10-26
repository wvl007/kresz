var ga = null;
	//
	// Disclaimer: This is my first time using React, I'm using this project to
	// experiment with this framework, so please forgive me for my code.
	// Also, I really should spend time on practicing these questions, rather than
	// writing this mini application. :D But all contribution and feedback is
	// welcome.
	//

	// Source: http://coenraets.org/blog/2014/12/animated-page-transitions-with-react-js/
	var router = (function () {
		"use strict";

		var routes = [];

		function addRoute(route, handler) {
			routes.push({parts: route.split('/'), handler: handler});
		}

		function load(route) {
			window.location.hash = route;
		}

		function start() {
			var path = window.location.hash.substr(1),
				parts = path.split('/'),
				partsLength = parts.length;

			for (var i = 0; i < routes.length; i++) {
				var route = routes[i];
				if (route.parts.length === partsLength) {
					var params = [];
					for (var j = 0; j < partsLength; j++) {
						if (route.parts[j].substr(0, 1) === ':') {
							params.push(parts[j]);
						} else if (route.parts[j] !== parts[j]) {
							break;
						}
					}
					if (j === partsLength) {
						route.handler.apply(undefined, params);
						return;
					}
				}
			}
		}

		window.onhashchange = start;

		return {
			addRoute: addRoute,
			load: load,
			start: start
		};
	}());

	// Source: http://coenraets.org/blog/2014/12/animated-page-transitions-with-react-js/
	var PageSlider = {
		getInitialState: function () {
			return {
				history: [],
				pages: [],
				animating: false
			}
		},
		componentDidUpdate: function() {
			// var skippedCurrentFrame = false,
			// 	pageEl = this.getDOMNode().lastChild,
			// 	pages = this.state.pages,
			// 	l = pages.length,
			// 	transitionEndHandler = function() {
			// 		pageEl.removeEventListener('webkitTransitionEnd', transitionEndHandler);
			// 		pages.shift();
			// 		this.setState({pages: pages});
			// 	}.bind(this),
			// 	animate = function() {
			// 		if (!skippedCurrentFrame) {
			// 			skippedCurrentFrame = true;
			// 			requestAnimationFrame(animate.bind(this));
			// 		} else if (l > 0) {
			// 			// pages[l - 1].props.position = "center transition";
			// 			pages[l - 1].position = "page-center page-transition";
			// 			this.setState({pages: pages, animating: false});
			// 			pageEl.addEventListener('webkitTransitionEnd', transitionEndHandler);
			// 		}
			// 	};

			// if (this.state.animating) {
			// 	requestAnimationFrame(animate.bind(this));
			// }
		},
		slidePage: function (page) {
			// var history = this.state.history,
			// 	pages = this.state.pages,
			// 	l = history.length,
			// 	hash = window.location.hash,
			// 	position = "page-center";

			// if (l === 0) {
			// 	history.push(hash);
			// } else if (hash === history[l - 2]) {
			// 	history.pop();
			// 	position = "page-left";
			// } else {
			// 	history.push(hash);
			// 	position = "page-right";
			// }

			// pages.push({page: page, position: position});

			// this.setState({history: history, pages: pages, animating: position!=="page-center"});
			this.setState({pages: [{page: page, position: ''}]})
		},
		render: function () {
			var content = this.state.pages.map(function(item, i) {
				return (
					React.createElement("div", {className: "page " + item.position, key: i}, 
						React.createElement("div", {className: "container"}, 
							item.page
						)
					)
				);
			});

			return (
				React.createElement("div", {className: "pageslider-container"}, 
					content
				)
			);
		}
	};

	var App = React.createClass({displayName: 'App',
		componentDidMount: function() {
			var $el = $(React.findDOMNode(this));
			$el.find('.button-collapse').sideNav();
			$el.find('#nav-mobile a').on('click', function() {
				$('.button-collapse').sideNav('hide');
			});
		},
		render: function() {
			return (
				React.createElement("div", null, 
					React.createElement("nav", {className: "teal lighten-1", role: "navigation"}, 
						React.createElement("div", {className: "nav-wrapper container"}, React.createElement("a", {id: "logo-container", href: "#", className: "brand-logo"}, "KRESZ teszt"), 
							React.createElement("ul", {className: "right hide-on-med-and-down"}, 
								React.createElement("li", null, React.createElement("a", {href: "#"}, "Új teszt")), 
								React.createElement("li", null, React.createElement("a", {href: "#search"}, "Kereső")), 
								React.createElement("li", null, React.createElement("a", {href: "#info"}, "Infó")), 
								React.createElement("li", null, React.createElement("a", {href: "#statistics"}, "Statisztika"))
							), 
							React.createElement("ul", {id: "nav-mobile", className: "side-nav"}, 
								React.createElement("li", null, React.createElement("a", {href: "#"}, "Új teszt")), 
								React.createElement("li", null, React.createElement("a", {href: "#search"}, "Kereső")), 
								React.createElement("li", null, React.createElement("a", {href: "#info"}, "Infó")), 
								React.createElement("li", null, React.createElement("a", {href: "#statistics"}, "Statisztika"))
							), 
							React.createElement("a", {href: "#", 'data-activates': "nav-mobile", className: "button-collapse"}, 
								React.createElement("svg", {className: "nav-mobile-burger", viewBox: "0 0 24 24", width: "24", height: "24"}, 
									React.createElement("path", {fill: "#ffffff", d: "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"})
								)
							)
						)
					), 

					React.createElement(Content, null)
				)
			);
		}
	});

	var Content = React.createClass({displayName: 'Content',
		mixins: [PageSlider],
		componentDidMount: function() {
			router.addRoute('', function() {
				this.slidePage(React.createElement(WelcomePage, {key: "home"}));
			}.bind(this));
			router.addRoute('info', function() {
				this.slidePage(React.createElement(InfoPage, {key: "info"}));
			}.bind(this));
			router.addRoute('category/:categoryId', function(categoryId) {
				this.slidePage(React.createElement(Tester, {key: categoryId, categoryId: categoryId}));
			}.bind(this));
			router.addRoute('statistics', function() {
				this.slidePage(React.createElement(Statistics, {key: "stats"}));
			}.bind(this));
			router.addRoute('search', function() {
				this.slidePage(React.createElement(SearchPage, {key: "search"}));
			}.bind(this));
			router.addRoute('search/:categoryId', function(categoryId) {
				this.slidePage(React.createElement(SearchPage, {key: "search-" + categoryId, categoryId: categoryId}));
			}.bind(this));
			
			router.start();
		}
	});

	var navigate = function(where) {

	}

	var WelcomePage = React.createClass({displayName: 'WelcomePage',
		componentDidMount: function() {
			var self = this;
			// This is a temporary hack
			model.loaded.done(function() { if (self.isMounted()) self.forceUpdate(); });
		},
		render: function () {
			var self = this;

			var categoriesHtml = $.map(model.getCategories(), function (category) {
				return (
					React.createElement("a", {className: "collection-item", href: '#category/' + category.id, key: category.id}, category.title)
				);
			});

			var categoryTestsHtml = $.map(model.getCategories(), function (category) {
				return (
					React.createElement("a", {className: "collection-item", href: 'tests/' + category.id + '/index.html', key: category.id}, category.title)
				);
			});

			return (
				React.createElement("div", null, 
					React.createElement("div", {className: "card"}, 
						React.createElement("div", {className: "card-content"}, 
							React.createElement("span", {className: "card-title grey-text text-darken-4"}, React.createElement("h4", null, "KRESZ teszt")), 
							React.createElement("p", null, 
								"Üdv a KRESZ teszt alkalmazásban! Itt felkészülhetsz a KRESZ vizsgádra a megújult 2015-ös vizsga valós kérdéseivel." + ' ' +
								"További információ a tesztről, a kérdésekről és az alkalmazásról az ", React.createElement("a", {href: "#info"}, React.createElement("strong", null, "Infó")), " oldalon.", 
								React.createElement("br", null), React.createElement("br", null), 
								"A kérdésadatbázis a szakoe.hu oldalról származik, annak szerzői jogaival a E-Educatio Információtechnológia Zrt. rendelkezik.", 
								React.createElement("br", null), React.createElement("br", null), 
								"E-mail: ujkreszteszt (a) gmail.com"
							)
						)
					), 

					React.createElement("div", {className: "card teal lighten-5", style: {border: "1px solid #b2dfdb"}}, 
						React.createElement("div", {className: "card-content"}, 
							React.createElement("span", {className: "card-title teal-text text-darken-3", style: {fontSize: "1.25rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px"}}, 
								React.createElement("svg", {viewBox: "0 0 24 24", width: "24", height: "24", style: {fill: "#00796b", flexShrink: 0}}, 
									React.createElement("path", {d: "M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"})
								), 
								"Kérdések élő keresése"
							), 
							React.createElement("p", {style: {margin: "8px 0 14px", color: "#37474f"}}, 
								"Keress rá bármilyen kifejezésre (pl. „villamos”, „hólánc”, „elsőbbség”) vagy kérdéskódra a teljes hivatalos kérdésbankban a helyes válaszokkal együtt."
							), 
							React.createElement("a", {href: "#search", className: "btn waves-effect waves-light teal"}, "Kereső megnyitása")
						)
					), 

					React.createElement("div", {className: "collection with-header card"}, 
						React.createElement("div", {className: "collection-header"}, React.createElement("strong", null, "Teszt indítása – Válassz kategóriát!")), 
						categoriesHtml
					), 

					React.createElement("div", {className: "collection with-header card"}, 
						React.createElement("div", {className: "collection-header"}, React.createElement("strong", null, "Kérdésbank böngészése"), React.createElement("br", null), "Böngészd az egyes kategóriák teljes kérdésbankját (az összes kérdést)."), 
						categoryTestsHtml
					)
				)
			);
		}
	});

	var InfoPage = React.createClass({displayName: 'InfoPage',
		render: function () {
			return (
				React.createElement("div", null, 
					React.createElement("div", {className: "card"}, 
						React.createElement("div", {className: "card-content"}, 
							React.createElement("span", {className: "card-title grey-text text-darken-4"}, React.createElement("h4", null, "A KRESZ vizsgáról")), 
							React.createElement("p", null, "A KRESZ vizsga egy feletválasztós teszt, azaz minden kérdésnél több lehetséges megoldás közül kell kiválasztani a helyeset. Egy kérdés megválaszolására 60 másodperc (1 perc) áll rendelkezésre. A teszt kategóriától függően 55 (A - motor, B - személygépkocsi) vagy 25 (\"nagy kategóriák\") kérdésből áll, melyek 1 vagy 3 pontot érnek. A legtöbb kérdés 1 pontot ér, de van 10 ill. 5 db. úgynevezett \"képes kérdés\" - melyek forgalmi helyzetek felismerésére vonatkoznak - amik 3 pontot érnek. Így összesen 75 ill. 35 pont érhető el, melyből legalább 66 ill. 30 pontot kell elérni a sikeres vizsgához.")
						)
					), 

					React.createElement("div", {className: "card"}, 
						React.createElement("div", {className: "card-content"}, 
							React.createElement("span", {className: "card-title grey-text text-darken-4"}, React.createElement("h4", null, "Az alkalmazásról")), 
							React.createElement("p", null, "2015 elején megújult a KRESZ teszt, frissítették a tesztanyagot, kibővült a kérdésbank, és lecserélték a retró képeket napjaink elvárásának megfelelőre. A bevezetés kicsit gyorsra sikerült, ezért nem sikerült a meglévő segédanyagok frissítése. Látva a tanulók és oktatók nehéz helyzetét (nem lehet tudni, hogy pontosan miből kell felkészülni, mert se up to date segédanyagok, se a kérdések nem állnak rendelkezésre) a SZAKOE (Szakoktatók Országos Érdekképviseleti Egyesülete) megegyezett a vizsgakérdések tulajdonosával, hogy tegye elérhetővé a kérdéseket teszt formában. Ez igen hasznosnak bizonyult, azonban a kialakított felületre több negatív visszajelzés érkezett: ismétlődő kérdések, nehézkes használat, nem lehet egy kérdést 60 másodpercnél tovább nézni (gyakorlás céljából sem), nem elérhető mobilról (csak flash-sel rendelkező eszközről), egyes esetekben nem működik stb."), 
							React.createElement("br", null), 
							React.createElement("p", null, "Magam is hasonlókkal szembesültem, ezért a felkészülésemhez elkészítettem ezt a programot, ami a fenti hibákat próbálja orvosolni. Ugyanabból az adatbázisból dolgozik, ezért elvileg az összes KRESZ vizsgán előforduló kérdés megtalálható benne. A felület úgy lett kialakítva, hogy minél jobban segítse a felkészülést a tesztre: a tudás felmérését, a teljes kérdésbank megismerését, a hibás válaszokból való tanulást. Az alkalmazás HTML alapú, így mobilon is jól használható. A program két móddal rendelkezik."), 
							React.createElement("br", null), 
							React.createElement("p", null, "Az első a teljese kérdésbank megtekintése. Erre kattintva az adott kategóriához kapcsolódó összes kérdés megjelenik a helyes válasszal együtt. Így utána lehet nézni egyes témaköröknek, amit ez ember még kevésbé sajátított el."), 
							React.createElement("br", null), 
							React.createElement("p", null, "A másik mód a teszt mód. Ekkor az alkalmazás - különböző beállítások alapján - egy kérdéssort állít össze, amit meg kell válaszolni. Alap beállítás során előtérbe helyeződnek az új kérdések (hogy minél több kérdést megismerjünk) illetve a rontott kérdések (segíti memorizálni a helyes választ). Az egyes kérdések mellett mindig megjelenik egy csillag gomb, amivel a fontosabb/nehezebb kérdéseket meg lehet jelölni. A kérdéssor összeállításánál ezek is prioritást élveznek, és külön is elő lehet hívni őket. Minden kérdés megválaszolására 60 másodperc áll rendelkezésre, azonban a program - ellentétben a vizsgaszoftverrel - ennek lejárta után nem léptet tovább a következő kérdésre. Ez a gyakorlást szolgálja. A válasz megjelölése után rögtön láthatóvá válik a helyes megoldás - így rögtön látható a hibás válasz, és memorizálni lehet a helyeset.")
						)
					), 

					React.createElement("div", {className: "card"}, 
						React.createElement("div", {className: "card-content"}, 
							React.createElement("span", {className: "card-title grey-text text-darken-4"}, React.createElement("h4", null, "Javasolt tanulási módszer")), 
							React.createElement("p", null, "Az alábbiakban a saját KRESZ vizsgámhoz használt módszert írom le, mellyel hibátlan eredményt értem el."), 
							React.createElement("ol", null, 
								React.createElement("li", null, "A sikeres KRESZ vizsga legjobb garanciája a pontos tudás, melyet a legkönnyebben a KRESZ tanfolyamon való odafigyeléssel lehet elsajátítani. Tapasztalatból mondom, hogy érdemes odafigyelni, mert egyrészt így lehet a leggyorsabban elsajátítani a szükséges tudást, másrészt a megszerzett ismeretek egy egész életre jó alapot jelentenek."), 

								React.createElement("li", null, "A KRESZ tanfolyam közben és után érdemes pár (vagy több :) ) KRESZ teszt megoldásával kezdeni. Ha hibásan válaszolsz, semmi gond, próbáld meg megmorizálni a helyes választ, majd amikor a program legközelebb ugyanazt a kérdést dobbja (ezt direkt megteszi), akkor már jól tudsz válaszolni, és így rögzül a helyes megoldás. Ha egy kérdésre jól válaszolsz, de mégis úgy érzed, hogy gyakorolni kéne még, akkor kattints rá mellette a csillagra, így meg tudod jelölni."), 

								React.createElement("li", null, "Ha már sok tesztet megoldottál, látogass el a ", React.createElement("i", null, "Statisztikák"), " fülre. Itt látni fogod, hogy hogyan állsz az egyes témakörökkel, mi az amire érdemes ráfeküdni. Ha egy témakör nem megy, akkor olvass/kérdezz utána, illetve böngészd át a kérdéseit a ", React.createElement("i", null, "Kérdésbank böngészése"), " részen. Teszt formában is gyakorolhatod őket a kérdéssor testreszabásával."), 

								React.createElement("li", null, "Gyakorolj még többet."), 

								React.createElement("li", null, "Győződj meg róla, hogy a \"képes kérdések\" jól mennek. Ezek igazán fontosak, a teszten is 3 pontot érnek. Ha nem mennek, akkor elsősorban ne gyakorlással próbálj javítani, hanem nézz utána, hogy pontosan milyen szabályok érvényesek. Csak pár szabály van, de azokat pontosan kell tudni és alkalmazni. Mivel igen sok ilyen kérdés van, ezért az nem fog menni, hogy bemagolod a helyes válaszokat. Viszont ha azt a pár szabályt magabiztosan elsajátítod, minden kérdést meg fogsz tudni válaszolni."), 

								React.createElement("li", null, "Ha rendelkezel a régi (CD-s) KRESZ programmal, érdemes azt is kipróbálni, mert a vizsgán továbbra is ugyanazt a programot használják, csak új kérdésekkel. Tehát a valós vizsga kinézete/felülete/kezelőszervei megegyeznek az ott találhatóval, így nyugodtabban tudsz vizsgázni, hanem ott látod ezeket először."), 

								React.createElement("li", null, "A KRESZ vizsgád napján, vagy előtte egy nappal érdemes átismételni a nehéz kérdéseket. Ehhez menj az új teszt menüpontra, majd alul állítsd be, hogy 1) csak megjölt/rontott kérdéseket adjon 2) az összes ilyen kérdést adja ki, ne csak témakörönként egyet. Így az összes ilyen kérdést átnézheted, és memorizálhatod a helyes választ.")
							)
						)
					),

					React.createElement("div", {className: "card"}, 
						React.createElement("div", {className: "card-content"}, 
							React.createElement("span", {className: "card-title grey-text text-darken-4"}, React.createElement("h4", null, "Alkalmazás frissítése")), 
							React.createElement("p", null, "Ha az alkalmazást telepített appként (PWA) használod, vagy a legfrissebb kérdéseket és javításokat szeretnéd azonnal letölteni, kattints az alábbi gombra. A funkció kiüríti a helyi gyorsítótárat és betölti a legújabb verziót."), 
							React.createElement("br", null), 
							React.createElement("button", {
								className: "waves-effect waves-light btn teal lighten-1", 
								onClick: function() { if (window.forceAppUpdate) window.forceAppUpdate(); }
							}, "Alkalmazás kényszerített frissítése most")
						)
					)
				)
			);
		}
	});

	var Tester = React.createClass({displayName: 'Tester',
		getInitialState: function() {
			return {
				loading: true,
				category: null,
				test: null,
				showResult: false,
				groups: {},
				settings: {
					filter: 'all',
					prioritize: true,
					count: 'original',
					order: 'random',
					showTime: true,
					limitTime: false,
					instantCorrection: true,
					onepage: false,
					showHistory: true
				}
			};
		},
		componentDidMount: function() {
			var self = this;
			model.getCategory(this.props.categoryId).done(function(category) {
				var groups = {};
				$.each(category.groups, function(i, group) {
					groups[group.id] = true;
				});
				if (self.isMounted()) {
					self.setState({
						category: category,
						groups: groups,
						loading: false
					});
				}
			});
		},
		resetGroupSelection: function(select) {
			var groups = {};
			$.each(this.state.category.groups, function(i, group) {
				groups[group.id] = select;
			});
			this.setState({groups: groups});
		},
				startThreePointTest: function() {
			var groups = {};
			var hasThreePoint = false;
			$.each(this.state.category.groups, function(i, group) {
				if (group.score === 3) {
					groups[group.id] = true;
					hasThreePoint = true;
				} else {
					groups[group.id] = false;
				}
			});
			if (!hasThreePoint) {
				alert('Ebben a kategóriában nincsenek 3 pontos kérdések.');
				return;
			}
			var settings = {
				filter: 'all',
				prioritize: true,
				count: 'original',
				order: 'random',
				showTime: true,
				limitTime: false,
				instantCorrection: true,
				onepage: false,
				showHistory: true
			};
			var test = model.generateTest(this.state.category, settings, groups);
			if (!test || test.getQuestionCount() === 0) {
				alert('Ebben a kategóriában nem található 3 pontos kérdés.');
				return;
			}
			this.setState({
				test: test,
				settings: settings,
				showResult: false
			});
		},
		selectOnlyThreePointGroups: function() {
			var groups = {};
			$.each(this.state.category.groups, function(i, group) {
				groups[group.id] = (group.score === 3);
			});
			this.setState({groups: groups});
		},
		startRealTest: function() {
			var groups = {};
			$.each(this.state.category.groups, function(i, group) {
				groups[group.id] = true;
			});
			var settings = {
				filter: 'all',
				prioritize: false,
				count: 'original',
				order: 'random',
				showTime: true,
				limitTime: true,
				instantCorrection: false,
				onepage: false,
				showHistory: false
			};
			var test = model.generateTest(this.state.category, settings, groups);
			if (!test || test.getQuestionCount() === 0) {
				alert('Nem sikerült kérdéseket generálni ehhez a teszthez.');
				return;
			}
			this.setState({
				test: test,
				settings: settings,
				showResult: false
			});
		},
		startTest: function() {
			var test = model.generateTest(this.state.category, this.state.settings, this.state.groups);
			if (!test || test.getQuestionCount() === 0) {
				alert("A kiválasztott szűrőkkel és témakörökkel nem található kérdés!\n\nKérjük, ellenőrizd a beállításokat (pl. ne válassz 'Csak rontott kérdések' vagy 'Csak megjelöltek' szűrőt, ha még nincsenek rontott/megjelölt válaszaid), és jelölj be legalább egy témakört!");
				return;
			}
			this.setState({
				test: test,
				showResult: false
			});
		},
		showResult: function() {
			this.setState({showResult: true});
		},
		startNew: function(changeSettings) {
			if (changeSettings) {
				this.setState({test: null, showResult: false});
			} else {
				this.startTest();
			}
		},
		toggleSetting: function(setting, event) {
			var settings = $.extend({}, this.state.settings);
			settings[setting] = event.target.type == 'checkbox' ? event.target.checked : event.target.value;
			this.setState({settings: settings});
		},
		render: function() {
			if (this.state.loading || !this.state.category) {
				return React.createElement(Loading, null);
			}

			if (this.state.test) {
				if (this.state.showResult) {
					return React.createElement(TestResult, {
						category: this.state.category,
						test: this.state.test,
						settings: this.state.settings,
						startNewCallback: this.startNew
					});
				} else {
					return React.createElement(Test, {
						category: this.state.category,
						test: this.state.test,
						settings: this.state.settings,
						showResultCallback: this.showResult
					});
				}
			}

			var self = this;
			var groupsHtml = $.map(this.state.category.groups, function(group) {
				var id = 'group-' + group.id;
				return (
					React.createElement("p", {key: group.id, className: "option-item"}, 
						React.createElement("input", {
							type: "checkbox",
							id: id,
							checked: !!self.state.groups[group.id],
							onChange: function(e) {
								var groups = $.extend({}, self.state.groups);
								groups[group.id] = e.target.checked;
								self.setState({groups: groups});
							}
						}), 
						React.createElement("label", {htmlFor: id}, group.title + " (" + group.questions.length + " kérdés, " + group.score + " pont)")
					)
				);
			});

			var settings = this.state.settings;
			var settingsHtml = React.createElement("div", null, 
				React.createElement("div", {className: "row settings-row"}, 
					React.createElement("div", {className: "col m6 s12"}, 
						React.createElement("strong", {className: "settings-section-title"}, "Kérdések szűrése"), 
						React.createElement("p", {className: "option-item"}, 
							React.createElement("input", {name: "filter", type: "radio", id: "filter-all", value: "all", checked: settings.filter == 'all', onChange: this.toggleSetting.bind(this, 'filter')}), 
							React.createElement("label", {htmlFor: "filter-all"}, "Összes kérdés")
						), 
						React.createElement("p", {className: "option-item"}, 
							React.createElement("input", {name: "filter", type: "radio", id: "filter-new", value: "new-only", checked: settings.filter == 'new-only', onChange: this.toggleSetting.bind(this, 'filter')}), 
							React.createElement("label", {htmlFor: "filter-new"}, "Csak új kérdések")
						), 
						React.createElement("p", {className: "option-item"}, 
							React.createElement("input", {name: "filter", type: "radio", id: "filter-missed", value: "missed-only", checked: settings.filter == 'missed-only', onChange: this.toggleSetting.bind(this, 'filter')}), 
							React.createElement("label", {htmlFor: "filter-missed"}, "Csak rontott kérdések")
						), 
						React.createElement("p", {className: "option-item"}, 
							React.createElement("input", {name: "filter", type: "radio", id: "filter-marked", value: "marked-only", checked: settings.filter == 'marked-only', onChange: this.toggleSetting.bind(this, 'filter')}), 
							React.createElement("label", {htmlFor: "filter-marked"}, "Csak megjelölt kérdések")
						), 
						React.createElement("p", {className: "option-item"}, 
							React.createElement("input", {name: "filter", type: "radio", id: "filter-missed-marked", value: "missed-marked", checked: settings.filter == 'missed-marked', onChange: this.toggleSetting.bind(this, 'filter')}), 
							React.createElement("label", {htmlFor: "filter-missed-marked"}, "Rontott és megjelölt kérdések")
						)
					), 
					React.createElement("div", {className: "col m6 s12"}, 
						React.createElement("strong", {className: "settings-section-title"}, "Kérdések száma"), 
						React.createElement("p", {className: "option-item"}, 
							React.createElement("input", {name: "count", type: "radio", id: "count-original", value: "original", checked: settings.count == 'original', onChange: this.toggleSetting.bind(this, 'count')}), 
							React.createElement("label", {htmlFor: "count-original"}, "Eredeti vizsga szerinti")
						), 
						React.createElement("p", {className: "option-item"}, 
							React.createElement("input", {name: "count", type: "radio", id: "count-fixed10", value: "fixed10", checked: settings.count == 'fixed10', onChange: this.toggleSetting.bind(this, 'count')}), 
							React.createElement("label", {htmlFor: "count-fixed10"}, "Témakörönként 10 kérdés")
						), 
						React.createElement("p", {className: "option-item"}, 
							React.createElement("input", {name: "count", type: "radio", id: "count-all", value: "all", checked: settings.count == 'all', onChange: this.toggleSetting.bind(this, 'count')}), 
							React.createElement("label", {htmlFor: "count-all"}, "Összes kiválasztott kérdés")
						), 
						React.createElement("strong", {className: "settings-section-title", style: {marginTop: "16px"}}, "Egyéb beállítások"), 
						React.createElement("p", {className: "option-item"}, 
							React.createElement("input", {type: "checkbox", id: "opt-prioritize", checked: settings.prioritize, onChange: this.toggleSetting.bind(this, 'prioritize')}), 
							React.createElement("label", {htmlFor: "opt-prioritize"}, "Új és hibás kérdések előre sorolása")
						), 
						React.createElement("p", {className: "option-item"}, 
							React.createElement("input", {type: "checkbox", id: "opt-instant", checked: settings.instantCorrection, onChange: this.toggleSetting.bind(this, 'instantCorrection')}), 
							React.createElement("label", {htmlFor: "opt-instant"}, "Azonnali javítás és válaszmutatás")
						), 
						React.createElement("p", {className: "option-item"}, 
							React.createElement("input", {type: "checkbox", id: "opt-showTime", checked: settings.showTime, onChange: this.toggleSetting.bind(this, 'showTime')}), 
							React.createElement("label", {htmlFor: "opt-showTime"}, "Időmérés mutatása (stopper)")
						), 
						React.createElement("p", {className: "option-item"}, 
							React.createElement("input", {type: "checkbox", id: "opt-limitTime", checked: settings.limitTime, onChange: this.toggleSetting.bind(this, 'limitTime')}), 
							React.createElement("label", {htmlFor: "opt-limitTime"}, "Időkorlát bekapcsolása (60 mp visszaszámláló)")
						), 
						React.createElement("p", {className: "option-item"}, 
							React.createElement("input", {type: "checkbox", id: "opt-showHistory", checked: settings.showHistory, onChange: this.toggleSetting.bind(this, 'showHistory')}), 
							React.createElement("label", {htmlFor: "opt-showHistory"}, "Korábbi statisztika mutatása a kérdésnél")
						), 
						React.createElement("p", {className: "option-item"}, 
							React.createElement("input", {type: "checkbox", id: "opt-onepage", checked: settings.onepage, onChange: this.toggleSetting.bind(this, 'onepage')}), 
							React.createElement("label", {htmlFor: "opt-onepage"}, "Összes kérdés egy oldalon")
						)
					)
				)
			);

			return (
				React.createElement("div", null, 
					React.createElement("h3", null, this.state.category.title), 
					React.createElement("div", {className: "card"}, 
						React.createElement("div", {className: "card-content"}, 
							React.createElement("span", {className: "card-title grey-text text-darken-4"}, "Valós KRESZ teszt"), 
							React.createElement("p", null, "Hivatalos hatósági vizsgaszimuláció: fix 55 kérdés minden témakörből, szigorú 60 mp/kérdés időkorláttal, azonnali javítás nélkül (kiértékelés a legvégén).")
						), 
						React.createElement("div", {className: "card-action"}, 
							React.createElement("a", {className: "waves-effect waves-light btn teal lighten-1", onClick: this.startRealTest}, "Hivatalos vizsga indítása")

						)
					), 
					React.createElement("div", {className: "card"}, 
						React.createElement("div", {className: "card-content"}, 
							React.createElement("span", {className: "card-title grey-text text-darken-4"}, "Gyakorló teszt beállításai"), 
							settingsHtml
						),
						React.createElement("div", {className: "card-action"}, 
							React.createElement("a", {className: "waves-effect waves-light btn", onClick: this.startTest}, "Gyakorló teszt indítása a fenti beállításokkal")
						)
					),
					React.createElement("div", {className: "card"}, 
						React.createElement("div", {className: "card-content"}, 
							React.createElement("span", {className: "card-title grey-text text-darken-4"}, "Témakörök kiválasztása (szűréshez)"), 
							groupsHtml
						), 
						React.createElement("div", {className: "card-action"}, 
							React.createElement("a", {onClick: this.resetGroupSelection.bind(this, true)}, React.createElement("i", {className: "material-icons tiny hide"}, "done_all"), " Összes kiválasztása"), 
							React.createElement("a", {onClick: this.resetGroupSelection.bind(this, false)}, React.createElement("i", {className: "material-icons clear hide"}, "done_all"), " Kiválasztás törlése"), 
							React.createElement("a", {onClick: this.selectOnlyThreePointGroups}, React.createElement("i", {className: "material-icons tiny hide"}, "done_all"), " Csak a 3 pontosak kijelölése")
						)
					),
					React.createElement("div", {style: {textAlign: "center", margin: "20px 0"}}, 
						React.createElement("a", {className: "waves-effect waves-light btn btn-large", onClick: this.startTest}, "Gyakorló teszt indítása a kiválasztott témakörökkel")
					)
				)
			);
		}
	});

		var Test = React.createClass({displayName: 'Test',
		getInitialState: function() {
			return {
				qNum: 0,
				startTime: new Date()
			};
		},
		checkAnswer: function() {
			var question = (this.props.test && this.props.test.questions) ? this.props.test.questions[this.state.qNum] : null;
			if (question && question.selected !== null) {
				question.commitChoice();
				this.forceUpdate();
			}
		},
		handleKeyDown: function(e) {
			if (e.target && (e.target.tagName === 'TEXTAREA' || (e.target.tagName === 'INPUT' && e.target.type !== 'radio' && e.target.type !== 'checkbox'))) {
				return;
			}
			var key = e.key;
			var question = (this.props.test && this.props.test.questions) ? this.props.test.questions[this.state.qNum] : null;
			if (!question) return;

			var isChecked = !!question.committed;
			var isInstant = !!this.props.settings.instantCorrection;

			var choiceIndex = -1;
			if (key === '1' || key === 'a' || key === 'A') choiceIndex = 0;
			else if (key === '2' || key === 'b' || key === 'B') choiceIndex = 1;
			else if (key === '3' || key === 'c' || key === 'C') choiceIndex = 2;
			else if (key === '4' || key === 'd' || key === 'D') choiceIndex = 3;
			else if (key === '5' || key === 'e' || key === 'E') choiceIndex = 4;

			if (choiceIndex !== -1 && choiceIndex < question.choices.length) {
				if (!isChecked) {
					question.selectChoice(choiceIndex);
					this.forceUpdate();
				}
				e.preventDefault();
				return;
			}

			if (key === ' ' || key === 'Enter') {
				e.preventDefault();
				if (isInstant && !isChecked && question.selected !== null) {
					this.checkAnswer();
				} else {
					this.nextQuestion();
				}
				return;
			}

			if (key === 's' || key === 'S' || key === '*') {
				question.setMarked(!question.isMarked());
				this.forceUpdate();
				e.preventDefault();
				return;
			}
		},
		componentDidMount: function() {
			window.addEventListener('keydown', this.handleKeyDown);
		},
		componentWillUnmount: function() {
			window.removeEventListener('keydown', this.handleKeyDown);
		},
		nextQuestion: function() {
			var currentQuestion = this.props.test && this.props.test.questions ? this.props.test.questions[this.state.qNum] : null;
			if (currentQuestion) {
				currentQuestion.commitChoice();
			}

			if (!this.props.test || this.state.qNum + 1 >= this.props.test.getQuestionCount()) {
				return this.finishTest();
			}

			this.setState({qNum: this.state.qNum + 1});

			if (ga) { ga('send', 'event', 'test', 'next-question', this.props.category.id); }
		},
		finishTest: function() {
			if (this.props.test && this.props.test.questions) {
				$.each(this.props.test.questions, function(i, q) {
					q.commitChoice();
				});
			}
			if (model.recordExamResult && this.props.test) {
				model.recordExamResult(this.props.test);
			}
			this.props.showResultCallback();
		},
		render: function() {
			var self = this;
			if (!this.props.test || !this.props.test.questions || this.props.test.questions.length === 0) {
				return (
					React.createElement("div", {className: "card"},
						React.createElement("div", {className: "card-content"},
							React.createElement("p", {className: "flow-text"}, "Nincsenek megjeleníthető kérdések a megadott beállításokkal."),
							React.createElement("br", null),
							React.createElement("a", {className: "waves-effect waves-light btn", onClick: function() { history.back(); }}, "Vissza a beállításokhoz")
						)
					)
				);
			}
			var question = this.props.test.questions[this.state.qNum];
			var isChecked = !!question.committed;
			var isInstant = !!this.props.settings.instantCorrection;
			var isLastQuestion = this.state.qNum + 1 >= this.props.test.getQuestionCount();

			var questionHtml = !this.props.settings.onepage ?
				(React.createElement(Question, {
					key: question.id,
					question: question, 
					settings: this.props.settings, 
					nextQuestionCallback: this.nextQuestion, 
					onChoiceSelected: function() { self.forceUpdate(); },
					type: "test"
				})) :
				$.map(this.props.test.questions, function(q) {
					return React.createElement(Question, {
						question: q, 
						settings: self.props.settings, 
						nextQuestionCallback: $.noop, 
						onChoiceSelected: function() { self.forceUpdate(); },
						type: "test", 
						key: q.id
					});
				});

			var primaryActionBtn = null;
			if (isInstant && !isChecked) {
				if (question.selected === null) {
					primaryActionBtn = React.createElement("a", {
						className: "waves-effect waves-light btn teal lighten-2", 
						onClick: this.nextQuestion,
						title: "Kérdés átugrása válasz nélkül (Szóköz)"
					}, "Kérdés kihagyása / Passz");
				} else {
					primaryActionBtn = React.createElement("a", {
						className: "waves-effect waves-light btn teal darken-1", 
						onClick: this.checkAnswer,
						title: "Válasz ellenőrzése (Szóköz)"
					}, "Válasz ellenőrzése");
				}
			} else {
				primaryActionBtn = React.createElement("a", {
					className: "waves-effect waves-light btn teal", 
					onClick: this.nextQuestion,
					title: isLastQuestion ? "Teszt befejezése" : "Következő kérdés (Szóköz)"
				}, isLastQuestion ? "Teszt befejezése" : "Következő kérdés (Szóköz)");
			}

			var buttonsHtml = this.props.settings.onepage ?
				React.createElement("a", {className: "waves-effect waves-light btn", title: "Mutasd az eredményt!", onClick: this.finishTest}, "Teszt befejezése") :
				React.createElement("div", {className: "row test-controls-row"}, 
					React.createElement("div", {className: "col m4 s12"}, primaryActionBtn), 
					React.createElement("div", {className: "test-progress-question-count col m4 s12"}, this.state.qNum + 1, " / ", this.props.test.getQuestionCount()), 
					React.createElement("div", {className: "col m4 s12"}, React.createElement("a", {className: "waves-effect waves-teal btn-flat right", title: "Mutasd az eredményt!", onClick: this.finishTest}, "Teszt befejezése"))
				);

			return (
				React.createElement("div", null, 
					React.createElement("h3", null, this.props.category.title), 
					questionHtml, 
					buttonsHtml
				)
			);
		}
	});

	var TestResult = React.createClass({displayName: 'TestResult',
		startNew: function(changeSettings) {
			this.props.startNewCallback(changeSettings);
		},
		render: function() {
			var self = this;

			// Use custom settings on the result page
			var settings = $.extend({}, self.props.settings);
			settings.showHistory = true;

			var questionsHtml = $.map(this.props.test.questions, function(question) {
				return React.createElement(Question, {question: question, settings: settings, type: "result", key: question.id})
			});

			return (
				React.createElement("div", null, 
					React.createElement("h3", null, this.props.category.title), 
					React.createElement("p", null, React.createElement("strong", null, "Eredmény: ", 
						this.props.test.getTotalScore(), " / ", this.props.test.getMaxScore(), " pont (", this.props.test.getPercentage(), "%)  – ", 
						this.props.test.getCorrectAnswers(), " / ", this.props.test.getQuestionCount(), " kérdés  – ", 
						this.props.test.isPassed() ? React.createElement("span", {className: "green-text text-darken-3"}, "Átment") : React.createElement("span", {className: "red-text text-darken-3"}, "Nem sikerült")
					)), 
					questionsHtml, 
					React.createElement("div", {className: "row test-controls-row"}, 
						React.createElement("div", {className: "col m6 s12 center-align"}, React.createElement("a", {className: "waves-effect waves-light btn", onClick: this.startNew.bind(this, false)}, "Új teszt azonos beállításokkal")), 
						React.createElement("div", {className: "col m6 s12 center-align"}, React.createElement("a", {className: "waves-effect waves-light btn", onClick: this.startNew.bind(this, true)}, "Új teszt más beállításokkal"))
					)
				)
			);
		}
	});

	var Question = React.createClass({displayName: 'Question',
		getInitialState: function () {
			return {
				showAnswers: false,
				startTime: (new Date).getTime(),
				timer: null
			};
		},
		selectChoice: function(event) {
			var question = this.props.question;
			if (!question || this.props.type !== 'test') return;

			var isChecked = !!question.committed;
			var isInstant = !!this.props.settings.instantCorrection;

			if (isInstant && isChecked) return;

			var val = parseInt(event.target.value);
			question.selectChoice(val);
			this.forceUpdate();

			if (this.props.onChoiceSelected) {
				this.props.onChoiceSelected(val);
			}

			if (ga) { ga('send', 'event', 'test', 'select-choice', question.group.category.id); }
		},
		toggleMark: function() {
			this.props.question.setMarked(!this.props.question.isMarked());
			this.forceUpdate();
		},
		getElapsedTime: function() {
			if (!this.props.question) return 0;
			return this.props.type == 'test' ? (Math.round(((new Date).getTime() - this.state.startTime) / 1000) + (this.props.question.elapsedTime || 0)) : this.props.question.elapsedTime;
		},
		getRemainingTime: function() {
			if (!this.props.question || !this.props.question.group || !this.props.question.group.category) return 0;
			return this.props.question.group.category.exTimeLimit - this.getElapsedTime();
		},
		getTimeState: function(timeVal) {
			if (!this.props.settings.limitTime) {
				return 'ok';
			}
			if (timeVal > 10) {
				return 'ok';
			} else if (timeVal >= 0) {
				return 'warn';
			} else {
				return 'expired';
			}
		},
		updateTime: function() {
			if (!this.refs || !this.refs.time) return;
			var $el = $(React.findDOMNode(this.refs.time));
			if (!this.props.settings.showTime) {
				$el.addClass('hide');
				return;
			}
			$el.removeClass('hide');

			var isLimit = !!this.props.settings.limitTime && this.props.type == 'test';
			var timeVal = isLimit ? this.getRemainingTime() : this.getElapsedTime();
			var sign = timeVal >= 0 ? '' : '-';
			var absVal = Math.abs(timeVal);
			var seconds = absVal % 60;
			var minutes = (absVal - seconds) / 60;
			var timeStr = sign + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
			var stateClass = this.getTimeState(timeVal);
			var label = isLimit ? 'Hátralévő idő' : 'Eltelt idő';

			var html = '<span class="question-time-label" style="font-size:11px;font-weight:600;color:#78909c;display:block;line-height:1.2;">' + label + ':</span><span class="question-time-val question-time-val-' + stateClass + '">' + timeStr + '</span>';
			$el.attr('title', label + ': ' + timeStr);
			$el.html(html);
		},
		startTimeUpdate: function() {
			var self = this;
			if (this.state && this.state.timeCallback) {
				clearInterval(this.state.timeCallback);
			}

			if (!this.props.settings.showTime && !this.props.settings.limitTime) {
				return;
			}

			this.setState({
				startTime: (new Date).getTime(),
				timeCallback: setInterval(function() {
					if (self.props.settings.limitTime) {
						var remainingTime = self.getRemainingTime();
						if (remainingTime < 0) {
							self.stopTimeUpdate();
							self.nextQuestion();
							return;
						}
					}
					if (self.props.settings.showTime) {
						self.updateTime();
					}
				}, 1000)
			});
		},
		stopTimeUpdate: function() {
			if (this.state && this.state.timeCallback) {
				clearInterval(this.state.timeCallback);
				this.state.timeCallback = null;
				if (this.props.question) {
					this.props.question.elapsedTime = this.getElapsedTime();
				}
			}
		},
		componentWillMount: function() {
			if ((this.props.settings.showTime || this.props.settings.limitTime) && this.props.type == 'test') {
				this.startTimeUpdate();
			}
		},
		componentWillReceiveProps: function(newProps) {
			if (newProps.question && this.props.question && newProps.question.id !== this.props.question.id) {
				this.stopTimeUpdate();
				if ((newProps.settings.showTime || newProps.settings.limitTime) && newProps.type == 'test') {
					this.startTimeUpdate();
				}
			}
		},
		componentDidMount: function() {
			if (this.props.settings.showTime) {
				this.updateTime();
			}
		},
		componentWillUnmount: function() {
			this.stopTimeUpdate();
		},
		componentDidUpdate: function() {
			var question = this.props.question;
			var isChecked = !!(question && question.committed);
			var isInstant = !!this.props.settings.instantCorrection;
			var isLocked = (this.props.type === 'result') || (isInstant && isChecked);

			if (isLocked) {
				this.stopTimeUpdate();
			} else if (this.props.settings.showTime) {
				this.updateTime();
			}
		},
		nextQuestion: function() {
			this.props.nextQuestionCallback();
		},
		render: function() {
			var self = this;
			var question = this.props.question;
			if (!question) {
				return React.createElement("div", null);
			}

			var isChecked = !!question.committed;
			var isInstant = !!this.props.settings.instantCorrection;
			var isLocked = (this.props.type === 'result') || (isInstant && isChecked);
			var showAnswers = (this.props.type === 'result') || (isInstant && isChecked) || this.state.showAnswers;
			var selected = question.selected !== null;


			var choicesHtml = $.map(question.choices, function(choice, i) {
				var id = 'question-answer-' + self.props.question.id + '-' + i;
				var choiceClass = '';
				if (showAnswers) {
					if (question.correct == i) {
						choiceClass = 'choice-right';
					} else if (question.selected == i) {
						choiceClass = 'choice-wrong';
					}
				}
				return (
					React.createElement("p", {key: i, className: choiceClass}, 
						React.createElement("input", {
							type: "radio", 
							name: 'question-choice-' + self.props.question.id,
							checked: question.selected === i, 
							value: i, 
							id: id, 
							disabled: isLocked, 
							onChange: self.selectChoice
						}), 
						React.createElement("label", {htmlFor: id}, React.createElement("span", {className: "badge-key"}, (i + 1)), choice)
					)
				);
			});

			var imageHtml = $.map(question.assets, function(asset, i) {
				return (
					React.createElement("img", {className: "question-image", src: 'data/asset/' + asset, key: i})
				);
			});

			var questionLinkHtml = (this.props.type == 'result') ?
				React.createElement("a", {target: 'category_' + question.group.category.id, href: 'tests/' + question.group.category.id + '/group-' + question.group.id + '.html#question-' + question.id, className: "teal-text right"}, React.createElement("small", null, "#", question.id)) :
				'';

			return (
				React.createElement("div", {className: 'card ' + (showAnswers ? ' show-answers' : '') + (selected ? ' decided' : ' undecided') + (showAnswers && selected ? (this.props.question.isCorrect() ? ' question-right green lighten-5' : ' question-wrong red lighten-5') : '')},
					React.createElement("div", {className: "card-content question-content"}, 
						imageHtml, 
						React.createElement("div", {className: "question-main"}, 
							React.createElement("p", {className: "question-text"}, 
								question.question, " ", 
								questionLinkHtml
							), 
							choicesHtml
						)
					), 

					React.createElement("div", {className: "card-action row question-footer"}, 
						React.createElement("div", {className: "col s4"}, 
							React.createElement("strong", null, "Témakör:"), " ", question.group.title
						), 
						React.createElement("div", {className: 'col ' + (this.props.settings.showHistory ? '' : 'hide ') + (this.props.settings.showTime ? 's2' : 's4') + ' question-score'}, 
							React.createElement("span", {className: "green-text text-darken-3", title: "Helyes válaszok száma"}, question.getCorrectCount()), " – ", 
							React.createElement("span", {className: "red-text text-darken-3", title: "Hibás válaszok száma"}, question.getMissedCount())
						), 
						React.createElement("div", {className: 'col question-time ' + (this.props.settings.showTime ? '' : 'hide ') + (this.props.settings.showHistory ? 's2' : 's4'), title: "Hátra lévő idő", ref: "time"}
						), 
						React.createElement("div", {className: 'col ' + (!this.props.settings.showHistory && !this.props.settings.showTime ? 's8' : 's4')}, 
							React.createElement("a", {className: 'question-mark right btn-floating waves-effect waves-light teal ' + (question.isMarked() ? '' : 'lighten-3'), onClick: this.toggleMark, title: "Kérdés megjelölése későbbi előhívhatóság céljából"}, 
								React.createElement("svg", {viewBox: "0 0 24 24", width: "20", height: "20", style: {fill: question.isMarked() ? "#ffd54f" : "#ffffff"}}, 
									React.createElement("path", {d: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"})
								)
							)
						)
					)
				)
			);
		}
	});

	var Loading = React.createClass({displayName: 'Loading',
		render: function () {
			return (
				React.createElement("div", {className: "progress"}, 
					React.createElement("div", {className: "indeterminate"})
				)
			);
		}
	});

	var Statistics = React.createClass({displayName: 'Statistics',
		getInitialState: function() {
			return {
				data: [],
				exams: (model.getExamHistory ? model.getExamHistory() : [])
			};
		},
		loadData: function() {
			var self = this;
			model.getStatistics().done(function(data) {
				if (self.isMounted()) {
					self.setState({
						data: data,
						exams: (model.getExamHistory ? model.getExamHistory() : [])
					});
				}
			});
		},
		componentDidMount: function() {
			this.loadData();
		},
		handleReset: function() {
			if (window.confirm("Biztosan törölni szeretnéd az összes eddigi statisztikát és a vizsganaplót?\nA művelet végleges és nem vonható vissza.")) {
				model.resetAllStatistics();
				this.loadData();
			}
		},
		render: function() {
			var self = this;

			// Exam log table
			var examRows = this.state.exams.length === 0 ?
				React.createElement("tr", null, 
					React.createElement("td", {colSpan: 5, className: "grey-text center-align stats-empty-cell", style: {padding: "24px 12px", whiteSpace: "normal"}}, 
						React.createElement("p", {style: {margin: "8px 0", fontSize: "14.5px"}}, "Még nem fejeztél be teljes vizsgát. Tölts ki egy tesztet az eredmények megtekintéséhez!")
					)
				) :
				$.map(this.state.exams, function(ex, idx) {
					var d = new Date(ex.date);
					var dateStr = d.getFullYear() + '.' + 
						('0' + (d.getMonth() + 1)).slice(-2) + '.' + 
						('0' + d.getDate()).slice(-2) + ' ' + 
						('0' + d.getHours()).slice(-2) + ':' + 
						('0' + d.getMinutes()).slice(-2);
					return (
						React.createElement("tr", {key: idx, className: "stats-exam-row"}, 
							React.createElement("td", {'data-label': "Dátum"}, 
								React.createElement("span", {className: "stats-value stats-col-date"}, dateStr)
							), 
							React.createElement("td", {'data-label': "Kategória"}, 
								React.createElement("span", {className: "stats-value stats-col-category"}, ex.categoryTitle)
							), 
							React.createElement("td", {'data-label': "Elért pontszám"}, 
								React.createElement("span", {className: "stats-value stats-col-score"}, 
									React.createElement("strong", null, ex.score, " / ", ex.maxScore, " pont"), " (", ex.percentage, "%)"
								)
							), 
							React.createElement("td", {'data-label': "Helyes válaszok"}, 
								React.createElement("span", {className: "stats-value stats-col-answers"}, ex.correctAnswers, " / ", ex.questionCount, " kérdés")
							), 
							React.createElement("td", {'data-label': "Eredmény"}, 
								React.createElement("span", {className: "stats-value stats-col-result"}, 
									ex.passed ? 
										React.createElement("span", {className: "stats-badge badge green white-text"}, "Átment") :
										React.createElement("span", {className: "stats-badge badge red white-text"}, "Nem sikerült")
								)
							)
						)
					);
				});

			var examHistoryCard = React.createElement("div", {className: "card"}, 
				React.createElement("div", {className: "card-content"}, 
					React.createElement("span", {className: "card-title grey-text text-darken-4"}, "Korábbi vizsgák naplója"), 
					React.createElement("div", {className: "stats-table-wrapper"}, 
						React.createElement("table", {className: "centered stats-table"}, 
							React.createElement("thead", null, 
								React.createElement("tr", null, 
									React.createElement("th", null, "Dátum"), 
									React.createElement("th", null, "Kategória"), 
									React.createElement("th", null, "Elért pontszám"), 
									React.createElement("th", null, "Helyes válaszok"), 
									React.createElement("th", null, "Eredmény")
								)
							), 
							React.createElement("tbody", null, examRows)
						)
					)
				)
			);

			var categoriesHtml = $.map(this.state.data, function(row) {
				var groupsHtml = $.map(row.groups, function(entry) {
					return (
						React.createElement("tr", {key: entry.group.id, className: "stats-group-row"}, 
							React.createElement("td", {'data-label': "Témakör", className: "statistics-group-title"}, entry.group.title), 
							React.createElement("td", {'data-label': "Kérdések / pont"}, 
								React.createElement("span", {className: "stats-value stats-col-info"}, entry.group.count, " kérdés, ", entry.group.score, " pont")
							), 
							React.createElement("td", {'data-label': "Összes kérdés"}, 
								React.createElement("span", {className: "stats-value stats-col-total"}, entry.group.questions.length)
							), 
							React.createElement("td", {'data-label': "Megválaszolt"}, 
								React.createElement("span", {className: "stats-value stats-col-answered"}, entry.answered)
							), 
							React.createElement("td", {'data-label': "Helyes"}, 
								React.createElement("span", {className: "stats-value stats-col-right green-text text-darken-2"}, entry.right)
							), 
							React.createElement("td", {'data-label': "Rossz"}, 
								React.createElement("span", {className: "stats-value stats-col-wrong red-text text-darken-2"}, entry.wrong)
							)
						)
					);
				});

				return (
					React.createElement("div", {className: "card", key: row.category.id}, 
						React.createElement("div", {className: "card-content"}, 
							React.createElement("span", {className: "card-title grey-text text-darken-4"}, row.category.title), 
							React.createElement("div", {className: "stats-table-wrapper"}, 
								React.createElement("table", {className: "centered stats-table"}, 
									React.createElement("thead", null, 
										React.createElement("tr", null, 
											React.createElement("th", null, "Témakör"), 
											React.createElement("th", null, "Kérdések / pont"), 
											React.createElement("th", null, "Összes kérdés"), 
											React.createElement("th", null, "Megválaszolt"), 
											React.createElement("th", {title: "Legalább egyszer helyesen megválaszolt kérdések száma"}, "Helyes"), 
											React.createElement("th", {title: "Legalább egyszer rosszul megválaszolt kérdések száma"}, "Rossz")
										)
									), 
									React.createElement("tbody", null, 
										groupsHtml
									)
								)
							)
						)
					)
				);
			});

			return (
				React.createElement("div", null, 
					React.createElement("div", {className: "stats-header-container"}, 
						React.createElement("h3", {className: "stats-title"}, "Statisztika és Vizsganapló"), 
						React.createElement("div", {className: "stats-header-actions"}, 
							React.createElement("button", {className: "waves-effect waves-light btn red lighten-1 stats-reset-btn", onClick: this.handleReset, title: "Minden korábbi eredmény és statisztika törlése"}, "Statisztika törlése")
						)
					), 
					examHistoryCard, 
					categoriesHtml
				)
			);
		}
	});

	// http://coenraets.org/blog/2014/12/animated-page-transitions-with-react-js/


	var SearchQuestionCard = React.createClass({displayName: 'SearchQuestionCard',
		toggleMark: function(e) {
			if (e) e.preventDefault();
			var q = this.props.question;
			q.setMarked(!q.isMarked());
			this.forceUpdate();
			if (this.props.onToggleMark) {
				this.props.onToggleMark(q);
			}
		},
		render: function() {
			var question = this.props.question;
			var self = this;

			var choicesHtml = $.map(question.choices, function(choice, i) {
				var isCorrect = (question.correct === i);
				return (
					React.createElement("div", {
						key: i, 
						className: "search-choice-item " + (isCorrect ? "search-choice-correct green lighten-5" : ""),
						style: {
							padding: "9px 12px",
							margin: "5px 0",
							borderRadius: "6px",
							border: isCorrect ? "1.5px solid #2e7d32" : "1px solid #e0e0e0",
							display: "flex",
							alignItems: "flex-start",
							gap: "10px",
							fontWeight: isCorrect ? "600" : "normal",
							color: isCorrect ? "#1b5e20" : "#37474f",
							background: isCorrect ? "#e8f5e9" : "#ffffff"
						}
					}, 
						React.createElement("span", {
							style: {
								display: "inline-flex",
								alignItems: "center",
								justifyContent: "center",
								width: "22px",
								height: "22px",
								borderRadius: "50%",
								background: isCorrect ? "#2e7d32" : "#eceff1",
								color: isCorrect ? "#ffffff" : "#607d8b",
								fontSize: "12px",
								fontWeight: "bold",
								flexShrink: 0
							}
						}, isCorrect ? "✓" : (i + 1)), 
						React.createElement("span", {style: {flex: "1 1 auto"}}, choice)
					)
				);
			});

			var imageHtml = (question.assets && question.assets.length > 0) ?
				$.map(question.assets, function(asset, i) {
					return React.createElement("img", {
						className: "question-image search-card-image", 
						src: 'data/asset/' + asset, 
						key: i,
						alt: "KRESZ kérdés ábra"
					});
				}) : null;

			var questionLinkHtml = question.group && question.group.category ?
				React.createElement("a", {
					target: '_blank', 
					href: 'tests/' + question.group.category.id + '/group-' + question.group.id + '.html#question-' + question.id, 
					className: "teal-text text-darken-2",
					rel: "noopener noreferrer",
					title: "Megnyitás a témakör külön oldalán"
				}, React.createElement("small", null, "#", question.id)) :
				React.createElement("small", {className: "grey-text"}, "#", question.id);

			var marked = question.isMarked();
			var scoreStats = (question.getCorrectCount() > 0 || question.getMissedCount() > 0) ?
				React.createElement("span", {style: {fontSize: "12px", marginRight: "10px", color: "#546e7a"}},
					React.createElement("span", {className: "green-text text-darken-3", title: "Helyes válaszok"}, question.getCorrectCount()), " – ",
					React.createElement("span", {className: "red-text text-darken-3", title: "Hibás válaszok"}, question.getMissedCount())
				) : null;

			return (
				React.createElement("div", {className: "card search-result-card", key: question.id, style: {marginBottom: "16px"}}, 
					React.createElement("div", {className: "card-content", style: {padding: "16px 20px 14px 20px"}}, 
						React.createElement("div", {style: {display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px"}}, 
							React.createElement("span", {
								className: "chip", 
								style: {margin: 0, height: "26px", lineHeight: "26px", fontSize: "12px", background: "#e0f2f1", color: "#004d40"}
							}, 
								React.createElement("strong", null, "Témakör: "), " ", 
								(question.group ? question.group.title : "")
							), 
							React.createElement("div", {style: {display: "flex", alignItems: "center"}}, 
								scoreStats,
								questionLinkHtml, 
								React.createElement("a", {
									className: "btn-floating btn-small waves-effect waves-light " + (marked ? "amber lighten-1" : "grey lighten-2"), 
									onClick: this.toggleMark, 
									title: marked ? "Megjelölés törlése" : "Kérdés megjelölése gyakorláshoz", 
									style: {width: "30px", height: "30px", lineHeight: "30px", marginLeft: "10px", display: "inline-flex", alignItems: "center", justifyContent: "center"}
								}, 
									React.createElement("svg", {viewBox: "0 0 24 24", width: "16", height: "16", style: {fill: marked ? "#ffffff" : "#78909c"}}, 
										React.createElement("path", {d: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"})
									)
								)
							)
						), 
						React.createElement("div", {className: "question-content", style: {padding: "4px 0 0 0"}}, 
							imageHtml, 
							React.createElement("div", {className: "question-main"}, 
								React.createElement("p", {className: "question-text", style: {fontSize: "1.05rem", fontWeight: "600", marginBottom: "12px"}}, 
									question.question
								), 
								choicesHtml
							)
						)
					)
				)
			);
		}
	});

	var SearchPage = React.createClass({displayName: 'SearchPage',
		getInitialState: function() {
			return {
				categoryId: this.props.categoryId || '166852',
				categories: model.getCategories() || [],
				query: '',
				filterType: 'all', // 'all', 'marked', 'missed'
				loading: true,
				questions: [],
				limit: 30
			};
		},
		componentDidMount: function() {
			var self = this;
			model.loaded.done(function() {
				if (!self.isMounted()) return;
				var cats = model.getCategories();
				var catId = self.state.categoryId;
				if (!catId && cats.length > 0) catId = cats[0].id;
				self.setState({categories: cats, categoryId: catId});
				self.loadCategoryQuestions(catId);
			});
		},
		loadCategoryQuestions: function(catId) {
			var self = this;
			this.setState({loading: true});
			model.getCategoryQuestions(catId).done(function(questions) {
				if (self.isMounted()) {
					self.setState({
						loading: false,
						questions: questions,
						categoryId: catId,
						limit: 30
					});
				}
			}).fail(function() {
				if (self.isMounted()) {
					self.setState({loading: false});
				}
			});
		},
		handleCategoryChange: function(e) {
			var newCatId = e.target.value;
			this.setState({query: '', filterType: 'all', limit: 30});
			this.loadCategoryQuestions(newCatId);
		},
		handleQueryChange: function(e) {
			this.setState({
				query: e.target.value,
				filterType: 'all',
				limit: 30
			});
		},
		clearQuery: function() {
			this.setState({query: '', filterType: 'all', limit: 30});
			if (this.refs.searchInput) {
				React.findDOMNode(this.refs.searchInput).focus();
			}
		},
		applyChip: function(text) {
			this.setState({
				query: text,
				filterType: 'all',
				limit: 30
			});
			if (this.refs.searchInput) {
				React.findDOMNode(this.refs.searchInput).focus();
			}
		},
		setFilterType: function(type) {
			var newType = (this.state.filterType === type) ? 'all' : type;
			this.setState({
				filterType: newType,
				limit: 30
			});
		},
		loadMore: function() {
			this.setState({limit: this.state.limit + 30});
		},
		getFilteredQuestions: function() {
			var query = this.state.query;
			var filterType = this.state.filterType;
			var list = this.state.questions;

			if (filterType === 'marked') {
				list = list.filter(function(q) { return q.isMarked(); });
			} else if (filterType === 'missed') {
				list = list.filter(function(q) { return q.getMissedCount() > 0; });
			}

			var trimmed = query.trim();
			if (!trimmed) {
				return list;
			}

			var norm = function(s) {
				return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
			};

			var terms = trimmed.split(/\s+/).filter(Boolean).map(norm);

			return list.filter(function(q) {
				var idStr = String(q.id);
				if (!q._searchable) {
					q._searchable = norm(q.question + ' ' + (q.choices ? q.choices.join(' ') : '') + ' ' + (q.group ? q.group.title : ''));
				}
				return terms.every(function(t) {
					return idStr.indexOf(t) !== -1 || q._searchable.indexOf(t) !== -1;
				});
			});
		},
		render: function() {
			var self = this;
			if (this.state.loading) {
				return React.createElement(Loading, null);
			}

			var filtered = this.getFilteredQuestions();
			var visibleMatches = filtered.slice(0, this.state.limit);
			var hasMore = filtered.length > this.state.limit;
			var trimmed = this.state.query.trim();

			// Marked / Missed stats counts
			var markedCount = 0;
			var missedCount = 0;
			this.state.questions.forEach(function(q) {
				if (q.isMarked()) markedCount++;
				if (q.getMissedCount() > 0) missedCount++;
			});

			var categoryOptions = $.map(this.state.categories, function(cat) {
				return React.createElement("option", {value: cat.id, key: cat.id}, cat.title);
			});

			var statsBanner = null;
			if (trimmed || this.state.filterType !== 'all') {
				if (filtered.length > 0) {
					statsBanner = React.createElement("div", {className: "search-stats-banner found"}, 
						React.createElement("span", null, 
							"Találatok száma: ", React.createElement("strong", null, filtered.length + " db"), " kérdés ", 
							(trimmed ? React.createElement("span", null, " a(z) ", React.createElement("em", null, "„" + trimmed + "”"), " kifejezésre") : "")
						), 
						React.createElement("span", {className: "grey-text text-darken-2"}, "Mutatva: 1 – " + visibleMatches.length)
					);
				} else {
					statsBanner = React.createElement("div", {className: "search-stats-banner empty"}, 
						React.createElement("span", null, "Nincs találat ", (trimmed ? React.createElement("span", null, " a(z) ", React.createElement("em", null, "„" + trimmed + "”"), " kifejezésre.") : "a kiválasztott szűrésre."))
					);
				}
			} else {
				statsBanner = React.createElement("div", {className: "search-stats-banner found"}, 
					React.createElement("span", null, "Böngészés a teljes kérdésbankban: összesen ", React.createElement("strong", null, this.state.questions.length + " db"), " kérdés elérhető."), 
					React.createElement("span", {className: "grey-text text-darken-2"}, "Mutatva: 1 – " + visibleMatches.length)
				);
			}

			var cardsHtml = $.map(visibleMatches, function(q) {
				return React.createElement(SearchQuestionCard, {
					key: q.id, 
					question: q,
					onToggleMark: function() { self.forceUpdate(); }
				});
			});

			var loadMoreBtn = hasMore ?
				React.createElement("div", {style: {textAlign: "center", margin: "24px 0"}}, 
					React.createElement("button", {
						className: "btn waves-effect waves-light teal lighten-1", 
						onClick: this.loadMore,
						style: {padding: "0 28px", height: "42px", lineHeight: "42px"}
					}, 
						"További 30 találat betöltése (még " + (filtered.length - visibleMatches.length) + " db)"
					)
				) : null;

			return (
				React.createElement("div", {className: "search-page-container"}, 
					React.createElement("div", {className: "search-header-card"}, 
						React.createElement("div", {className: "search-category-select-wrapper"}, 
							React.createElement("label", {style: {fontSize: "14px", fontWeight: "600", color: "#37474f"}}, "Kategória:"), 
							React.createElement("select", {
								className: "search-category-select browser-default", 
								value: this.state.categoryId, 
								onChange: this.handleCategoryChange
							}, categoryOptions)
						), 
						React.createElement("div", {className: "search-input-container"}, 
							React.createElement("span", {className: "search-input-icon"}, 
								React.createElement("svg", {viewBox: "0 0 24 24", width: "20", height: "20"}, 
									React.createElement("path", {d: "M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"})
								)
							), 
							React.createElement("input", {
								ref: "searchInput", 
								type: "text", 
								className: "search-main-input", 
								placeholder: "Élő keresés kérdésre, szóra vagy kódra (pl. villamos, hólánc, 703366)...", 
								value: this.state.query, 
								onChange: this.handleQueryChange, 
								autoComplete: "off"
							}), 
							(this.state.query ? 
								React.createElement("button", {
									type: "button", 
									className: "search-input-clear", 
									onClick: this.clearQuery, 
									title: "Keresés törlése"
								}, "✕") : null
							)
						), 
						React.createElement("div", {className: "search-quick-tags"}, 
							React.createElement("span", {className: "search-quick-label"}, "Gyors szűrés:"), 
							(markedCount > 0 ? 
								React.createElement("span", {
									className: "search-tag-chip " + (this.state.filterType === 'marked' ? 'active' : ''), 
									onClick: function() { self.setFilterType('marked'); }
								}, "⭐ Megjelölt (" + markedCount + ")") : null
							), 
							(missedCount > 0 ? 
								React.createElement("span", {
									className: "search-tag-chip " + (this.state.filterType === 'missed' ? 'active' : ''), 
									onClick: function() { self.setFilterType('missed'); }
								}, "❌ Rontott (" + missedCount + ")") : null
							), 
							React.createElement("span", {className: "search-tag-chip", onClick: function() { self.applyChip('villamos'); }}, "Villamos"), 
							React.createElement("span", {className: "search-tag-chip", onClick: function() { self.applyChip('hólánc'); }}, "Hólánc"), 
							React.createElement("span", {className: "search-tag-chip", onClick: function() { self.applyChip('elsőbbség'); }}, "Elsőbbség"), 
							React.createElement("span", {className: "search-tag-chip", onClick: function() { self.applyChip('fék'); }}, "Fékberendezés"), 
							React.createElement("span", {className: "search-tag-chip", onClick: function() { self.applyChip('vasúti'); }}, "Vasúti átjáró"), 
							React.createElement("span", {className: "search-tag-chip", onClick: function() { self.applyChip('sebesség'); }}, "Sebesség")
						)
					), 
					statsBanner, 
					cardsHtml, 
					loadMoreBtn
				)
			);
		}
	});
