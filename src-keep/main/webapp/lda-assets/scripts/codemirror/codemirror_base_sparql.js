function method(f, l) {
	return function() {
		f[l].apply(f, arguments)
	}
}
var StopIteration = {
	toString : function() {
		return "StopIteration"
	}
};
function forEach(f, l) {
	if (f.next)
		try {
			for (;;)
				l(f.next())
		} catch (j) {
			if (j != StopIteration)
				throw j;
		}
	else
		for ( var m = 0; m < f.length; m++)
			l(f[m])
}
function map(f, l) {
	var j = [];
	forEach(f, function(m) {
		j.push(l(m))
	});
	return j
}
function matcher(f) {
	return function(l) {
		return f.test(l)
	}
}
function hasClass(f, l) {
	var j = f.className;
	return j && RegExp("(^| )" + l + "($| )").test(j)
}
function insertAfter(f, l) {
	l.parentNode.insertBefore(f, l.nextSibling);
	return f
}
function removeElement(f) {
	f.parentNode && f.parentNode.removeChild(f)
}
function clearElement(f) {
	for (; f.firstChild;)
		f.removeChild(f.firstChild)
}
function isAncestor(f, l) {
	for (; l = l.parentNode;)
		if (f == l)
			return true;
	return false
}
var nbsp = "\u00a0", matching = {
	"{" : "}",
	"[" : "]",
	"(" : ")",
	"}" : "{",
	"]" : "[",
	")" : "("
};
function normalizeEvent(f) {
	if (!f.stopPropagation) {
		f.stopPropagation = function() {
			this.cancelBubble = true
		};
		f.preventDefault = function() {
			this.returnValue = false
		}
	}
	if (!f.stop)
		f.stop = function() {
			this.stopPropagation();
			this.preventDefault()
		};
	if (f.type == "keypress") {
		f.code = f.charCode == null ? f.keyCode : f.charCode;
		f.character = String.fromCharCode(f.code)
	}
	return f
}
function addEventHandler(f, l, j, m) {
	function n(o) {
		j(normalizeEvent(o || window.event))
	}
	if (typeof f.addEventListener == "function") {
		f.addEventListener(l, n, false);
		if (m)
			return function() {
				f.removeEventListener(l, n, false)
			}
	} else {
		f.attachEvent("on" + l, n);
		if (m)
			return function() {
				f.detachEvent("on" + l, n)
			}
	}
}
function nodeText(f) {
	return f.textContent || f.innerText || f.nodeValue || ""
}
function nodeTop(f) {
	for ( var l = 0; f.offsetParent;) {
		l += f.offsetTop;
		f = f.offsetParent
	}
	return l
}
function isBR(f) {
	f = f.nodeName;
	return f == "BR" || f == "br"
}
function isSpan(f) {
	f = f.nodeName;
	return f == "SPAN" || f == "span"
};
var stringStream = function(f) {
	function l() {
		for (; m == j.length;) {
			n += j;
			j = "";
			m = 0;
			try {
				j = f.next()
			} catch (o) {
				if (o != StopIteration)
					throw o;
				else
					return false
			}
		}
		return true
	}
	var j = "", m = 0, n = "";
	return {
		peek : function() {
			if (!l())
				return null;
			return j.charAt(m)
		},
		next : function() {
			if (!l())
				if (n.length > 0)
					throw "End of stringstream reached without emptying buffer ('"
							+ n + "').";
				else
					throw StopIteration;
			return j.charAt(m++)
		},
		get : function() {
			var o = n;
			n = "";
			if (m > 0) {
				o += j.slice(0, m);
				j = j.slice(m);
				m = 0
			}
			return o
		},
		push : function(o) {
			j = j.slice(0, m) + o + j.slice(m)
		},
		lookAhead : function(o, s, p, a) {
			function c(i) {
				return a ? i.toLowerCase() : i
			}
			o = c(o);
			var b = false, d = n, e = m;
			for (p && this.nextWhileMatches(/[\s\u00a0]/);;) {
				p = m + o.length;
				var g = j.length - m;
				if (p <= j.length) {
					b = o == c(j.slice(m, p));
					m = p;
					break
				} else if (o.slice(0, g) == c(j.slice(m))) {
					n += j;
					j = "";
					try {
						j = f.next()
					} catch (h) {
						break
					}
					m = 0;
					o = o.slice(g)
				} else
					break
			}
			if (!(b && s)) {
				j = n.slice(d.length) + j;
				m = e;
				n = d
			}
			return b
		},
		more : function() {
			return this.peek() !== null
		},
		applies : function(o) {
			var s = this.peek();
			return s !== null && o(s)
		},
		nextWhile : function(o) {
			for ( var s; (s = this.peek()) !== null && o(s);)
				this.next()
		},
		matches : function(o) {
			var s = this.peek();
			return s !== null && o.test(s)
		},
		nextWhileMatches : function(o) {
			for ( var s; (s = this.peek()) !== null && o.test(s);)
				this.next()
		},
		equals : function(o) {
			return o === this.peek()
		},
		endOfLine : function() {
			var o = this.peek();
			return o == null || o == "\n"
		}
	}
};
var select = {};
(function() {
	function f(b, d) {
		for (; b && b.parentNode != d;)
			b = b.parentNode;
		return b
	}
	function l(b, d) {
		for (; !b.previousSibling && b.parentNode != d;)
			b = b.parentNode;
		return f(b.previousSibling, d)
	}
	function j(b) {
		var d = b.nextSibling;
		if (d) {
			for (; d.firstChild;)
				d = d.firstChild;
			return d.nodeType == 3 || isBR(d) ? d : j(d)
		} else {
			for (b = b.parentNode; b && !b.nextSibling;)
				b = b.parentNode;
			return b && j(b)
		}
	}
	select.ie_selection = document.selection
			&& document.selection.createRangeCollection;
	select.scrollToNode = function(b, d) {
		if (b) {
			for ( var e = b, g = document.body, h = document.documentElement, i = !e.nextSibling
					|| !e.nextSibling.nextSibling
					|| !e.nextSibling.nextSibling.nextSibling, k = 0; e
					&& !e.offsetTop;) {
				k++;
				e = e.previousSibling
			}
			if (k == 0)
				i = false;
			if (!(webkit && e && e.offsetTop == 5 && e.offsetLeft == 5)) {
				k = k * (e ? e.offsetHeight : 0);
				var r = 0, u = b ? b.offsetWidth : 0;
				for (e = e; e && e.offsetParent;) {
					k += e.offsetTop;
					isBR(e) || (r += e.offsetLeft);
					e = e.offsetParent
				}
				e = g.scrollLeft || h.scrollLeft || 0;
				g = g.scrollTop || h.scrollTop || 0;
				var t = false, q = window.innerWidth || h.clientWidth || 0;
				if (d || u < q) {
					if (d) {
						var x = select.offsetInNode(b), y = nodeText(b).length;
						if (y)
							r += u * (x / y)
					}
					u = r - e;
					if (u < 0 || u > q) {
						e = r;
						t = true
					}
				}
				r = k - g;
				if (r < 0 || i
						|| r > (window.innerHeight || h.clientHeight || 0) - 50) {
					g = i ? 1E6 : k;
					t = true
				}
				t && window.scrollTo(e, g)
			}
		}
	};
	select.scrollToCursor = function(b) {
		select.scrollToNode(select.selectionTopNode(b, true) || b.firstChild,
				true)
	};
	var m = null;
	select.snapshotChanged = function() {
		if (m)
			m.changed = true
	};
	select.snapshotReplaceNode = function(b, d, e, g) {
		function h(i) {
			if (b == i.node) {
				m.changed = true;
				if (e && i.offset > e)
					i.offset -= e;
				else {
					i.node = d;
					i.offset += g || 0
				}
			} else if (select.ie_selection && i.offset == 0 && i.node == j(b))
				m.changed = true
		}
		if (m) {
			h(m.start);
			h(m.end)
		}
	};
	select.snapshotMove = function(b, d, e, g, h) {
		function i(k) {
			if (b == k.node && (!h || k.offset == 0)) {
				m.changed = true;
				k.node = d;
				k.offset = g ? Math.max(0, k.offset + e) : e
			}
		}
		if (m) {
			i(m.start);
			i(m.end)
		}
	};
	if (select.ie_selection) {
		var n = function() {
			var b = document.selection;
//			return b && (b.createRange || b.createTextRange)();
// laid out above logic more carefully for IE6.
			return !b ? b : b.createRange ? b.createRange() : b.createTextRange();
		}, o = function(b) {
			function d(u) {
				for ( var t = null; !t && u;) {
					t = u.nextSibling;
					u = u.parentNode
				}
				return e(t)
			}
			function e(u) {
				for (; u && u.firstChild;)
					u = u.firstChild;
				return {
					node : u,
					offset : 0
				}
			}
			var g = n();
			g.collapse(b);
			b = g.parentElement();
			if (!isAncestor(document.body, b))
				return null;
			if (!b.firstChild)
				return e(b);
			var h = g.duplicate();
			h.moveToElementText(b);
			h.collapse(true);
			for ( var i = b.firstChild; i; i = i.nextSibling) {
				if (i.nodeType == 3) {
					var k = i.nodeValue.length;
					h.move("character", k)
				} else {
					h.moveToElementText(i);
					h.collapse(false)
				}
				var r = g.compareEndPoints("StartToStart", h);
				if (r == 0)
					return d(i);
				if (r != 1) {
					if (i.nodeType != 3)
						return e(i);
					h.setEndPoint("StartToEnd", g);
					return {
						node : i,
						offset : k - h.text.length
					}
				}
			}
			return d(b)
		};
		select.markSelection = function() {
			m = null;
			if (document.selection) {
				var b = o(true), d = o(false);
				if (b && d)
					m = {
						start : b,
						end : d,
						changed : false
					}
			}
		};
		select.selectMarked = function() {
			function b(g) {
				var h = document.body.createTextRange(), i = g.node;
				if (i)
					if (i.nodeType == 3) {
						h.moveToElementText(i.parentNode);
						for (g = g.offset; i.previousSibling;) {
							i = i.previousSibling;
							g += (i.innerText || "").length
						}
						h.move("character", g)
					} else {
						h.moveToElementText(i);
						h.collapse(true)
					}
				else {
					h.moveToElementText(document.body);
					h.collapse(false)
				}
				return h
			}
			if (m && m.changed) {
				var d = b(m.start), e = b(m.end);
				d.setEndPoint("StartToEnd", e);
				d.select()
			}
		};
		select.offsetInNode = function(b) {
			var d = n();
			if (!d)
				return 0;
			var e = d.duplicate();
			try {
				e.moveToElementText(b)
			} catch (g) {
				return 0
			}
			d.setEndPoint("StartToStart", e);
			return d.text.length
		};
		select.selectionTopNode = function(b, d) {
			function e(t, q) {
				if (q.nodeType == 3) {
					for ( var x = 0, y = q.previousSibling; y
							&& y.nodeType == 3;) {
						x += y.nodeValue.length;
						y = y.previousSibling
					}
					if (y) {
						try {
							t.moveToElementText(y)
						} catch (v) {
							return false
						}
						t.collapse(false)
					} else
						t.moveToElementText(q.parentNode);
					x && t.move("character", x)
				} else
					try {
						t.moveToElementText(q)
					} catch (w) {
						return false
					}
				return true
			}
			var g = n();
			if (!g)
				return false;
			var h = g.duplicate();
			g.collapse(d);
			var i = g.parentElement();
			if (i && isAncestor(b, i)) {
				h.moveToElementText(i);
				if (g.compareEndPoints("StartToStart", h) == 1)
					return f(i, b)
			}
			d = 0;
			for (i = b.childNodes.length - 1; d < i;) {
				var k = Math.ceil((i + d) / 2), r = b.childNodes[k];
				if (!r)
					return false;
				if (!e(h, r))
					return false;
				if (g.compareEndPoints("StartToStart", h) == 1)
					d = k;
				else
					i = k - 1
			}
			if (d == 0) {
				g = n();
				h = g.duplicate();
				try {
					h.moveToElementText(b)
				} catch (u) {
					return null
				}
				if (g.compareEndPoints("StartToStart", h) == 0)
					return null
			}
			return b.childNodes[d] || null
		};
		select.focusAfterNode = function(b, d) {
			var e = document.body.createTextRange();
			e.moveToElementText(b || d);
			e.collapse(!b);
			e.select()
		};
		select.somethingSelected = function() {
			var b = n();
			return b && b.text != ""
		};
		var s = function(b) {
			var d = n();
			if (d) {
				d.pasteHTML(b);
				d.collapse(false);
				d.select()
			}
		};
		select.insertNewlineAtCursor = function() {
			s("<br>")
		};
		select.insertTabAtCursor = function() {
			s("\u00a0\u00a0\u00a0\u00a0")
		};
		select.cursorPos = function(b, d) {
			var e = n();
			if (!e)
				return null;
			for ( var g = select.selectionTopNode(b, d); g && !isBR(g);)
				g = g.previousSibling;
			var h = e.duplicate();
			e.collapse(d);
			if (g) {
				h.moveToElementText(g);
				h.collapse(false)
			} else {
				try {
					h.moveToElementText(b)
				} catch (i) {
					return null
				}
				h.collapse(true)
			}
			e.setEndPoint("StartToStart", h);
			return {
				node : g,
				offset : e.text.length
			}
		};
		select.setCursorPos = function(b, d, e) {
			function g(i) {
				var k = document.body.createTextRange();
				if (i.node) {
					k.moveToElementText(i.node);
					k.collapse(false)
				} else {
					k.moveToElementText(b);
					k.collapse(true)
				}
				k.move("character", i.offset);
				return k
			}
			var h = g(d);
			e && e != d && h.setEndPoint("EndToEnd", g(e));
			h.select()
		};
		select.getBookmark = function(b) {
			var d = select.cursorPos(b, true);
			b = select.cursorPos(b, false);
			if (d && b)
				return {
					from : d,
					to : b
				}
		};
		select.setBookmark = function(b, d) {
			d && select.setCursorPos(b, d.from, d.to)
		}
	} else {
		var p = function(b, d) {
			for (; b.nodeType != 3 && !isBR(b);) {
				var e = b.childNodes[d] || b.nextSibling;
				for (d = 0; !e && b.parentNode;) {
					b = b.parentNode;
					e = b.nextSibling
				}
				b = e;
				if (!e)
					break
			}
			return {
				node : b,
				offset : d
			}
		};
		select.markSelection = function() {
			var b = window.getSelection();
			if (!b || b.rangeCount == 0)
				return m = null;
			b = b.getRangeAt(0);
			m = {
				start : p(b.startContainer, b.startOffset),
				end : p(b.endContainer, b.endOffset),
				changed : false
			}
		};
		select.selectMarked = function() {
			function b() {
				if (e.start.node == e.end.node
						&& e.start.offset == e.end.offset) {
					var h = window.getSelection();
					if (!h || h.rangeCount == 0)
						return true;
					h = h.getRangeAt(0);
					h = p(h.startContainer, h.startOffset);
					return e.start.node != h.node || e.start.offset != h.offset
				}
			}
			function d(h, i) {
				if (h.node)
					h.offset == 0 ? g["set" + i + "Before"](h.node) : g["set"
							+ i](h.node, h.offset);
				else
					g.setStartAfter(document.body.lastChild || document.body)
			}
			var e = m;
			if (e && (e.changed || webkit && b())) {
				var g = document.createRange();
				d(e.end, "End");
				d(e.start, "Start");
				a(g)
			}
		};
		var a = function(b) {
			var d = window.getSelection();
			if (d) {
				d.removeAllRanges();
				d.addRange(b)
			}
		}, c = function() {
			var b = window.getSelection();
			return !b || b.rangeCount == 0 ? false : b.getRangeAt(0)
		};
		select.selectionTopNode = function(b, d) {
			var e = c();
			if (!e)
				return false;
			var g = d ? e.startContainer : e.endContainer, h = d ? e.startOffset
					: e.endOffset;
			window.opera && !d && e.endContainer == b
					&& e.endOffset == e.startOffset + 1
					&& b.childNodes[e.startOffset]
					&& isBR(b.childNodes[e.startOffset]) && h--;
			return g.nodeType == 3 ? h > 0 ? f(g, b) : l(g, b) : g.nodeName
					.toUpperCase() == "HTML" ? h == 1 ? null : b.lastChild
					: g == b ? h == 0 ? null : g.childNodes[h - 1]
							: h == g.childNodes.length ? f(g, b) : h == 0 ? l(
									g, b) : f(g.childNodes[h - 1], b)
		};
		select.focusAfterNode = function(b, d) {
			var e = document.createRange();
			e.setStartBefore(d.firstChild || d);
			if (b && !b.firstChild)
				e.setEndAfter(b);
			else
				b ? e.setEnd(b, b.childNodes.length) : e
						.setEndBefore(d.firstChild || d);
			e.collapse(false);
			a(e)
		};
		select.somethingSelected = function() {
			var b = c();
			return b && !b.collapsed
		};
		select.offsetInNode = function(b) {
			var d = c();
			if (!d)
				return 0;
			d = d.cloneRange();
			d.setStartBefore(b);
			return d.toString().length
		};
		select.insertNodeAtCursor = function(b) {
			var d = c();
			if (d) {
				d.deleteContents();
				d.insertNode(b);
				webkitLastLineHack(document.body);
				if (window.opera && isBR(b) && isSpan(b.parentNode)) {
					d = b.nextSibling;
					var e = b.parentNode, g = e.parentNode;
					g.insertBefore(b, e.nextSibling);
					for (e = ""; d && d.nodeType == 3; d = d.nextSibling) {
						e += d.nodeValue;
						removeElement(d)
					}
					g.insertBefore(makePartSpan(e, document), b.nextSibling)
				}
				d = document.createRange();
				d.selectNode(b);
				d.collapse(false);
				a(d)
			}
		};
		select.insertNewlineAtCursor = function() {
			select.insertNodeAtCursor(document.createElement("BR"))
		};
		select.insertTabAtCursor = function() {
			select.insertNodeAtCursor(document
					.createTextNode("\u00a0\u00a0\u00a0\u00a0"))
		};
		select.cursorPos = function(b, d) {
			var e = c();
			if (e) {
				for ( var g = select.selectionTopNode(b, d); g && !isBR(g);)
					g = g.previousSibling;
				e = e.cloneRange();
				e.collapse(d);
				g ? e.setStartAfter(g) : e.setStartBefore(b);
				e = e.toString();
				return {
					node : g,
					offset : e.length
				}
			}
		};
		select.setCursorPos = function(b, d, e) {
			function g(i, k, r) {
				function u(y) {
					y.nodeType == 3 ? t.push(y) : forEach(y.childNodes, u)
				}
				if (k == 0 && i && !i.nextSibling) {
					h["set" + r + "After"](i);
					return true
				}
				if (i = i ? i.nextSibling : b.firstChild) {
					if (k == 0) {
						h["set" + r + "Before"](i);
						return true
					}
					for ( var t = [];;) {
						for (; i && !t.length;) {
							u(i);
							i = i.nextSibling
						}
						var q = t.shift();
						if (!q)
							return false;
						var x = q.nodeValue.length;
						if (x >= k) {
							h["set" + r](q, k);
							return true
						}
						k -= x
					}
				}
			}
			var h = document.createRange();
			e = e || d;
			g(e.node, e.offset, "End") && g(d.node, d.offset, "Start") && a(h)
		}
	}
})();
function UndoHistory(f, l, j, m) {
	this.container = f;
	this.maxDepth = l;
	this.commitDelay = j;
	this.editor = m;
	this.parent = m.parent;
	this.last = this.first = f = {
		text : "",
		from : null,
		to : null
	};
	this.firstTouched = false;
	this.history = [];
	this.redoHistory = [];
	this.touched = []
}
UndoHistory.prototype = {
	scheduleCommit : function() {
		var f = this;
		this.parent.clearTimeout(this.commitTimeout);
		this.commitTimeout = this.parent.setTimeout(function() {
			f.tryCommit()
		}, this.commitDelay)
	},
	touch : function(f) {
		this.setTouched(f);
		this.scheduleCommit()
	},
	undo : function() {
		this.commit();
		if (this.history.length) {
			var f = this.history.pop();
			this.redoHistory.push(this.updateTo(f, "applyChain"));
			this.notifyEnvironment();
			return this.chainNode(f)
		}
	},
	redo : function() {
		this.commit();
		if (this.redoHistory.length) {
			var f = this.redoHistory.pop();
			this.addUndoLevel(this.updateTo(f, "applyChain"));
			this.notifyEnvironment();
			return this.chainNode(f)
		}
	},
	clear : function() {
		this.history = [];
		this.redoHistory = []
	},
	historySize : function() {
		return {
			undo : this.history.length,
			redo : this.redoHistory.length
		}
	},
	push : function(f, l, j) {
		for ( var m = [], n = 0; n < j.length; n++) {
			var o = n == j.length - 1 ? l : document.createElement("br");
			m.push({
				from : f,
				to : o,
				text : cleanText(j[n])
			});
			f = o
		}
		this.pushChains([ m ], f == null && l == null);
		this.notifyEnvironment()
	},
	pushChains : function(f, l) {
		this.commit(l);
		this.addUndoLevel(this.updateTo(f, "applyChain"));
		this.redoHistory = []
	},
	chainNode : function(f) {
		for ( var l = 0; l < f.length; l++) {
			var j = f[l][0];
			if (j = j && (j.from || j.to))
				return j
		}
	},
	reset : function() {
		this.history = [];
		this.redoHistory = []
	},
	textAfter : function(f) {
		return this.after(f).text
	},
	nodeAfter : function(f) {
		return this.after(f).to
	},
	nodeBefore : function(f) {
		return this.before(f).from
	},
	tryCommit : function() {
		!window
				|| !window.parent
				|| !window.UndoHistory
				|| (this.editor.highlightDirty() ? this.commit(true) : this
						.scheduleCommit())
	},
	commit : function(f) {
		this.parent.clearTimeout(this.commitTimeout);
		f || this.editor.highlightDirty(true);
		f = this.touchedChains();
		if (f.length) {
			this.addUndoLevel(this.updateTo(f, "linkChain"));
			this.redoHistory = [];
			this.notifyEnvironment()
		}
	},
	updateTo : function(f, l) {
		for ( var j = [], m = [], n = 0; n < f.length; n++) {
			j.push(this.shadowChain(f[n]));
			m.push(this[l](f[n]))
		}
		l == "applyChain" && this.notifyDirty(m);
		return j
	},
	notifyDirty : function(f) {
		forEach(f, method(this.editor, "addDirtyNode"));
		this.editor.scheduleHighlight()
	},
	notifyEnvironment : function() {
		this.onChange && this.onChange();
		window.frameElement && window.frameElement.CodeMirror.updateNumbers
				&& window.frameElement.CodeMirror.updateNumbers()
	},
	linkChain : function(f) {
		for ( var l = 0; l < f.length; l++) {
			var j = f[l];
			if (j.from)
				j.from.historyAfter = j;
			else
				this.first = j;
			if (j.to)
				j.to.historyBefore = j;
			else
				this.last = j
		}
	},
	after : function(f) {
		return f ? f.historyAfter : this.first
	},
	before : function(f) {
		return f ? f.historyBefore : this.last
	},
	setTouched : function(f) {
		if (f) {
			if (!f.historyTouched) {
				this.touched.push(f);
				f.historyTouched = true
			}
		} else
			this.firstTouched = true
	},
	addUndoLevel : function(f) {
		this.history.push(f);
		this.history.length > this.maxDepth && this.history.shift()
	},
	touchedChains : function() {
		function f(p, a) {
			if (p)
				p.historyTemp = a;
			else
				n = a
		}
		function l(p) {
			for ( var a = [], c = p ? p.nextSibling : m.container.firstChild; c
					&& (!isBR(c) || c.hackBR); c = c.nextSibling)
				!c.hackBR && c.currentText && a.push(c.currentText);
			return {
				from : p,
				to : c,
				text : cleanText(a.join(""))
			}
		}
		function j(p, a) {
			for ( var c = a + "Sibling", b = p[c]; b && !isBR(b);)
				b = b[c];
			return b
		}
		var m = this, n = null, o = [];
		m.firstTouched && m.touched.push(null);
		forEach(m.touched, function(p) {
			if (!(p && (p.parentNode != m.container || p.hackBR))) {
				if (p)
					p.historyTouched = false;
				else
					m.firstTouched = false;
				var a = l(p), c = m.after(p);
				if (!c || c.text != a.text || c.to != a.to) {
					o.push(a);
					f(p, a)
				}
			}
		});
		var s = [];
		m.touched = [];
		forEach(o, function(p) {
			if (p.from ? p.from.historyTemp : n) {
				for ( var a = [], c = p.from, b = true;;) {
					var d = c ? c.historyTemp : n;
					if (!d)
						if (b)
							break;
						else
							d = l(c);
					a.unshift(d);
					f(c, null);
					if (!c)
						break;
					b = m.after(c);
					c = j(c, "previous")
				}
				c = p.to;
				for (b = m.before(p.from);;) {
					if (!c)
						break;
					d = c ? c.historyTemp : n;
					if (!d)
						if (b)
							break;
						else
							d = l(c);
					a.push(d);
					f(c, null);
					b = m.before(c);
					c = j(c, "next")
				}
				s.push(a)
			}
		});
		return s
	},
	shadowChain : function(f) {
		var l = [], j = this.after(f[0].from);
		for (f = f[f.length - 1].to;;) {
			l.push(j);
			j = j.to;
			if (!j || j == f)
				break;
			else
				j = j.historyAfter || this.before(f)
		}
		return l
	},
	applyChain : function(f) {
		var l = select.cursorPos(this.container, false), j = this, m = f[0].from, n = f[f.length - 1].to;
		(function(b, d) {
			for ( var e = b ? b.nextSibling : j.container.firstChild; e != d;) {
				var g = e.nextSibling;
				removeElement(e);
				e = g
			}
		})(m, n);
		for ( var o = 0; o < f.length; o++) {
			var s = f[o];
			o > 0 && j.container.insertBefore(s.from, n);
			var p = makePartSpan(fixSpaces(s.text));
			j.container.insertBefore(p, n);
			if (l && l.node == s.from) {
				p = 0;
				var a = this.after(s.from);
				if (a && o == f.length - 1) {
					for ( var c = 0; c < l.offset
							&& s.text.charAt(c) == a.text.charAt(c); c++)
						;
					if (l.offset > c)
						p = s.text.length - a.text.length
				}
				select.setCursorPos(this.container, {
					node : s.from,
					offset : Math.max(0, l.offset + p)
				})
			} else
				l && o == f.length - 1 && l.node
						&& l.node.parentNode != this.container
						&& select.setCursorPos(this.container, {
							node : s.from,
							offset : s.text.length
						})
		}
		this.linkChain(f);
		return m
	}
};
var internetExplorer = document.selection && window.ActiveXObject
		&& /MSIE/.test(navigator.userAgent), webkit = /AppleWebKit/
		.test(navigator.userAgent), safari = /Apple Computer, Inc/
		.test(navigator.vendor), gecko = navigator.userAgent
		.match(/gecko\/(\d{8})/i);
if (gecko)
	gecko = Number(gecko[1]);
var mac = /Mac/.test(navigator.platform), brokenOpera = window.opera
		&& /Version\/10.[56]/.test(navigator.userAgent), slowWebkit = /AppleWebKit\/533/
		.test(navigator.userAgent);
function makeWhiteSpace(f) {
	for ( var l = [], j = true; f > 0; f--) {
		l.push(j || f == 1 ? nbsp : " ");
		j ^= true
	}
	return l.join("")
}
function fixSpaces(f) {
	if (f.charAt(0) == " ")
		f = nbsp + f.slice(1);
	return f.replace(/\t/g, function() {
		return makeWhiteSpace(indentUnit)
	}).replace(/[ \u00a0]{2,}/g, function(l) {
		return makeWhiteSpace(l.length)
	})
}
function cleanText(f) {
	return f.replace(/\u00a0/g, " ").replace(/\u200b/g, "")
}
function makePartSpan(f) {
	var l = f;
	if (f.nodeType == 3)
		l = f.nodeValue;
	else
		f = document.createTextNode(l);
	var j = document.createElement("span");
	j.isPart = true;
	j.appendChild(f);
	j.currentText = l;
	return j
}
function alwaysZero() {
	return 0
}
var webkitLastLineHack = webkit ? function(f) {
	var l = f.lastChild;
	if (!l || !l.hackBR) {
		l = document.createElement("br");
		l.hackBR = true;
		f.appendChild(l)
	}
} : function() {
}, Editor = function() {
	function f(a) {
		var c = makeWhiteSpace(indentUnit);
		return map(a.replace(/\t/g, c).replace(/\u00a0/g, " ").replace(
				/\r\n?/g, "\n").split("\n"), fixSpaces)
	}
	function l(a, c) {
		function b(g, h) {
			if (g.nodeType == 3) {
				if ((g.nodeValue = fixSpaces(g.nodeValue.replace(/[\r\u200b]/g,
						"").replace(/\n/g, " "))).length)
					e = false;
				d.push(g)
			} else if (isBR(g) && g.childNodes.length == 0) {
				e = true;
				d.push(g)
			} else {
				for ( var i = g.firstChild; i; i = i.nextSibling)
					b(i);
				if (!e && p.hasOwnProperty(g.nodeName.toUpperCase())) {
					e = true;
					if (!c || !h)
						d.push(document.createElement("br"))
				}
			}
		}
		var d = [], e = true;
		b(a, true);
		return d
	}
	function j(a) {
		function c(g) {
			var h = g.parentNode, i = g.nextSibling;
			return function(k) {
				h.insertBefore(k, i)
			}
		}
		var b = [], d = null, e = true;
		return {
			next : function() {
				if (!a)
					throw StopIteration;
				var g = a;
				a = g.nextSibling;
				var h;
				if (g.isPart && g.childNodes.length == 1
						&& g.firstChild.nodeType == 3) {
					g.currentText = g.firstChild.nodeValue;
					h = !/[\n\t\r]/.test(g.currentText)
				} else
					h = false;
				if (h) {
					b.push(g);
					e = false;
					return g.currentText
				} else if (isBR(g)) {
					e && window.opera
							&& g.parentNode.insertBefore(makePartSpan(""), g);
					b.push(g);
					e = true;
					return "\n"
				} else {
					h = !g.nextSibling;
					d = c(g);
					removeElement(g);
					g = l(g, h);
					for (h = 0; h < g.length; h++) {
						var i = g, k = h, r = g[h], u = "\n";
						if (r.nodeType == 3) {
							select.snapshotChanged();
							r = makePartSpan(r);
							u = r.currentText;
							e = false
						} else {
							e && window.opera && d(makePartSpan(""));
							e = true
						}
						r.dirty = true;
						b.push(r);
						d(r);
						i[k] = u
					}
					return g.join("")
				}
			},
			nodes : b
		}
	}
	function m(a) {
		for (; a && !isBR(a);)
			a = a.previousSibling;
		return a
	}
	function n(a, c) {
		if (a) {
			if (isBR(a))
				a = a.nextSibling
		} else
			a = c.firstChild;
		for (; a && !isBR(a);)
			a = a.nextSibling;
		return a
	}
	function o(a, c, b, d) {
		function e(i) {
			i = cleanText(a.history.textAfter(i));
			return d ? i.toLowerCase() : i
		}
		this.editor = a;
		this.history = a.history;
		this.history.commit();
		this.valid = !!c;
		this.atOccurrence = false;
		if (d == undefined)
			d = c == c.toLowerCase();
		var g = {
			node : null,
			offset : 0
		};
		if (b && typeof b == "object" && typeof b.character == "number") {
			a.checkLine(b.line);
			b = {
				node : b.line,
				offset : b.character
			};
			this.pos = {
				from : b,
				to : b
			}
		} else
			this.pos = b ? {
				from : select.cursorPos(a.container, true) || g,
				to : select.cursorPos(a.container, false) || g
			} : {
				from : g,
				to : g
			};
		if (d)
			c = c.toLowerCase();
		var h = c.split("\n");
		this.matches = h.length == 1 ? function(i, k, r) {
			var u = e(k), t = c.length, q;
			if (i ? r >= t && (q = u.lastIndexOf(c, r - t)) != -1 : (q = u
					.indexOf(c, r)) != -1)
				return {
					from : {
						node : k,
						offset : q
					},
					to : {
						node : k,
						offset : q + t
					}
				}
		} : function(i, k, r) {
			var u = i ? h.length - 1 : 0, t = h[u], q = e(k), x = i ? q
					.indexOf(t)
					+ t.length : q.lastIndexOf(t);
			if (!(i ? x >= r || x != t.length : x <= r
					|| x != q.length - t.length))
				for (r = k;;) {
					if (i && !r)
						break;
					r = i ? this.history.nodeBefore(r) : this.history
							.nodeAfter(r);
					if (!i && !r)
						break;
					q = e(r);
					t = h[i ? --u : ++u];
					if (u > 0 && u < h.length - 1)
						if (q != t)
							break;
						else
							continue;
					u = i ? q.lastIndexOf(t) : q.indexOf(t) + t.length;
					if (i ? u != q.length - t.length : u != t.length)
						break;
					return {
						from : {
							node : i ? r : k,
							offset : i ? u : x
						},
						to : {
							node : i ? k : r,
							offset : i ? x : u
						}
					}
				}
		}
	}
	function s(a) {
		this.options = a;
		window.indentUnit = a.indentUnit;
		this.parent = parent;
		var c = this.container = document.body;
		this.history = new UndoHistory(c, a.undoDepth, a.undoDelay, this);
		var b = this;
		if (!s.Parser)
			throw "No parser loaded.";
		a.parserConfig && s.Parser.configure
				&& s.Parser.configure(a.parserConfig);
		!a.readOnly && !internetExplorer && select.setCursorPos(c, {
			node : null,
			offset : 0
		});
		this.dirty = [];
		this.importCode(a.content || "");
		this.history.onChange = a.onChange;
		if (a.readOnly) {
			if (!a.textWrapping)
				c.style.whiteSpace = "nowrap"
		} else {
			if (a.continuousScanning !== false) {
				this.scanner = this.documentScanner(a.passTime);
				this.delayScanning()
			}
			var d = function() {
				if (document.body.contentEditable != undefined
						&& internetExplorer)
					document.body.contentEditable = "true";
				else
					document.designMode = "on";
				if (internetExplorer && a.height != "dynamic")
					document.body.style.minHeight = frameElement.clientHeight
							- 2 * document.body.offsetTop - 5 + "px";
				document.documentElement.style.borderWidth = "0";
				if (!a.textWrapping)
					c.style.whiteSpace = "nowrap"
			};
			try {
				d()
			} catch (e) {
				var g = addEventHandler(document, "focus", function() {
					g();
					d()
				}, true)
			}
			addEventHandler(document, "keydown", method(this, "keyDown"));
			addEventHandler(document, "keypress", method(this, "keyPress"));
			addEventHandler(document, "keyup", method(this, "keyUp"));
			var h = function() {
				b.cursorActivity(false)
			};
			addEventHandler(internetExplorer ? document.body : window,
					"mouseup", h);
			addEventHandler(document.body, "cut", h);
			gecko && addEventHandler(window, "pagehide", function() {
				b.unloaded = true
			});
			addEventHandler(document.body, "paste", function(i) {
				h();
				var k = null;
				try {
					var r = i.clipboardData || window.clipboardData;
					if (r)
						k = r.getData("Text")
				} catch (u) {
				}
				if (k !== null) {
					i.stop();
					b.replaceSelection(k);
					select.scrollToCursor(b.container)
				}
			});
			this.options.autoMatchParens
					&& addEventHandler(document.body, "click", method(this,
							"scheduleParenHighlight"))
		}
	}
	var p = {
		P : true,
		DIV : true,
		LI : true
	};
	o.prototype = {
		findNext : function() {
			return this.find(false)
		},
		findPrevious : function() {
			return this.find(true)
		},
		find : function(a) {
			function c() {
				var h = {
					node : e,
					offset : g
				};
				b.pos = {
					from : h,
					to : h
				};
				return b.atOccurrence = false
			}
			if (!this.valid)
				return false;
			var b = this, d = a ? this.pos.from : this.pos.to, e = d.node, g = d.offset;
			if (e && !e.parentNode) {
				e = null;
				g = 0
			}
			for (;;) {
				if (this.pos = this.matches(a, e, g))
					return this.atOccurrence = true;
				if (a) {
					if (!e)
						return c();
					e = this.history.nodeBefore(e);
					g = this.history.textAfter(e).length
				} else {
					d = this.history.nodeAfter(e);
					if (!d) {
						g = this.history.textAfter(e).length;
						return c()
					}
					e = d;
					g = 0
				}
			}
		},
		select : function() {
			if (this.atOccurrence) {
				select.setCursorPos(this.editor.container, this.pos.from,
						this.pos.to);
				select.scrollToCursor(this.editor.container)
			}
		},
		replace : function(a) {
			if (this.atOccurrence) {
				this.pos.to = this.editor.replaceRange(this.pos.from,
						this.pos.to, a);
				this.atOccurrence = false
			}
		},
		position : function() {
			if (this.atOccurrence)
				return {
					line : this.pos.from.node,
					character : this.pos.from.offset
				}
		}
	};
	s.prototype = {
		importCode : function(a) {
			this.history.push(null, null, f(a));
			this.history.reset()
		},
		getCode : function() {
			if (!this.container.firstChild)
				return "";
			var a = [];
			select.markSelection();
			forEach(j(this.container.firstChild), method(a, "push"));
			select.selectMarked();
			webkit && this.container.lastChild.hackBR && a.pop();
			webkitLastLineHack(this.container);
			return cleanText(a.join(""))
		},
		checkLine : function(a) {
			if (a === false || !(a == null || a.parentNode == this.container))
				throw parent.CodeMirror.InvalidLineHandle;
		},
		cursorPosition : function(a) {
			if (a == null)
				a = true;
			return (a = select.cursorPos(this.container, a)) ? {
				line : a.node,
				character : a.offset
			} : {
				line : null,
				character : 0
			}
		},
		firstLine : function() {
			return null
		},
		lastLine : function() {
			return this.container.lastChild ? m(this.container.lastChild)
					: null
		},
		nextLine : function(a) {
			this.checkLine(a);
			return n(a, this.container) || false
		},
		prevLine : function(a) {
			this.checkLine(a);
			if (a == null)
				return false;
			return m(a.previousSibling)
		},
		visibleLineCount : function() {
			for ( var a = this.container.firstChild; a && isBR(a);)
				a = a.nextSibling;
			if (!a)
				return false;
			return Math
					.floor((window.innerHeight
							|| document.documentElement.clientHeight || document.body.clientHeight)
							/ a.offsetHeight)
		},
		selectLines : function(a, c, b, d) {
			this.checkLine(a);
			a = {
				node : a,
				offset : c
			};
			c = null;
			if (d !== undefined) {
				this.checkLine(b);
				c = {
					node : b,
					offset : d
				}
			}
			select.setCursorPos(this.container, a, c);
			select.scrollToCursor(this.container)
		},
		lineContent : function(a) {
			var c = [];
			for (a = a ? a.nextSibling : this.container.firstChild; a
					&& !isBR(a); a = a.nextSibling)
				c.push(nodeText(a));
			return cleanText(c.join(""))
		},
		setLineContent : function(a, c) {
			this.history.commit();
			this.replaceRange({
				node : a,
				offset : 0
			}, {
				node : a,
				offset : this.history.textAfter(a).length
			}, c);
			this.addDirtyNode(a);
			this.scheduleHighlight()
		},
		removeLine : function(a) {
			for ( var c = a ? a.nextSibling : this.container.firstChild; c;) {
				var b = c.nextSibling;
				removeElement(c);
				if (isBR(c))
					break;
				c = b
			}
			this.addDirtyNode(a);
			this.scheduleHighlight()
		},
		insertIntoLine : function(a, c, b) {
			var d = null;
			if (c == "end")
				d = n(a, this.container);
			else
				for ( var e = a ? a.nextSibling : this.container.firstChild; e; e = e.nextSibling) {
					if (c == 0) {
						d = e;
						break
					}
					var g = nodeText(e);
					if (g.length > c) {
						d = e.nextSibling;
						b = g.slice(0, c) + b + g.slice(c);
						removeElement(e);
						break
					}
					c -= g.length
				}
			c = f(b);
			for (b = 0; b < c.length; b++) {
				b > 0
						&& this.container.insertBefore(document
								.createElement("BR"), d);
				this.container.insertBefore(makePartSpan(c[b]), d)
			}
			this.addDirtyNode(a);
			this.scheduleHighlight()
		},
		selectedText : function() {
			var a = this.history;
			a.commit();
			var c = select.cursorPos(this.container, true), b = select
					.cursorPos(this.container, false);
			if (!c || !b)
				return "";
			if (c.node == b.node)
				return a.textAfter(c.node).slice(c.offset, b.offset);
			var d = [ a.textAfter(c.node).slice(c.offset) ];
			for (c = a.nodeAfter(c.node); c != b.node; c = a.nodeAfter(c))
				d.push(a.textAfter(c));
			d.push(a.textAfter(b.node).slice(0, b.offset));
			return cleanText(d.join("\n"))
		},
		replaceSelection : function(a) {
			this.history.commit();
			var c = select.cursorPos(this.container, true), b = select
					.cursorPos(this.container, false);
			if (c && b) {
				b = this.replaceRange(c, b, a);
				select.setCursorPos(this.container, b);
				webkitLastLineHack(this.container)
			}
		},
		cursorCoords : function(a, c) {
			function b(k, r) {
				var u = -(document.body.scrollTop
						|| document.documentElement.scrollTop || 0), t = -(document.body.scrollLeft
						|| document.documentElement.scrollLeft || 0)
						+ r;
				forEach([ k, c ? null : window.frameElement ], function(q) {
					for (; q;) {
						t += q.offsetLeft;
						u += q.offsetTop;
						q = q.offsetParent
					}
				});
				return {
					x : t,
					y : u,
					yBot : u + k.offsetHeight
				}
			}
			function d(k, r) {
				var u = document.createElement("SPAN");
				u.appendChild(document.createTextNode(k));
				try {
					return r(u)
				} finally {
					u.parentNode && u.parentNode.removeChild(u)
				}
			}
			var e = select.cursorPos(this.container, a);
			if (!e)
				return null;
			for ( var g = e.offset, h = e.node, i = this; g;) {
				h = h ? h.nextSibling : this.container.firstChild;
				e = nodeText(h);
				if (g < e.length)
					return d(e.substr(0, g), function(k) {
						k.style.position = "absolute";
						k.style.visibility = "hidden";
						k.className = h.className;
						i.container.appendChild(k);
						return b(h, k.offsetWidth)
					});
				g -= e.length
			}
			return h && isSpan(h) ? b(h, h.offsetWidth) : h && h.nextSibling
					&& isSpan(h.nextSibling) ? b(h.nextSibling, 0) : d(
					"\u200b", function(k) {
						h ? h.parentNode.insertBefore(k, h.nextSibling)
								: i.container.insertBefore(k,
										i.container.firstChild);
						return b(k, 0)
					})
		},
		reroutePasteEvent : function() {
			if (!(this.capturingPaste || window.opera || gecko
					&& gecko >= 20101026)) {
				this.capturingPaste = true;
				var a = window.frameElement.CodeMirror.textareaHack, c = this
						.cursorCoords(true, true);
				a.style.top = c.y + "px";
				if (internetExplorer)
					if (c = select.getBookmark(this.container))
						this.selectionSnapshot = c;
				parent.focus();
				a.value = "";
				a.focus();
				var b = this;
				this.parent.setTimeout(function() {
					b.capturingPaste = false;
					window.focus();
					b.selectionSnapshot
							&& window.select.setBookmark(b.container,
									b.selectionSnapshot);
					var d = a.value;
					if (d) {
						b.replaceSelection(d);
						select.scrollToCursor(b.container)
					}
				}, 10)
			}
		},
		replaceRange : function(a, c, b) {
			b = f(b);
			b[0] = this.history.textAfter(a.node).slice(0, a.offset) + b[0];
			var d = b[b.length - 1];
			b[b.length - 1] = d
					+ this.history.textAfter(c.node).slice(c.offset);
			c = this.history.nodeAfter(c.node);
			this.history.push(a.node, c, b);
			return {
				node : this.history.nodeBefore(c),
				offset : d.length
			}
		},
		getSearchCursor : function(a, c, b) {
			return new o(this, a, c, b)
		},
		reindent : function() {
			this.container.firstChild
					&& this.indentRegion(null, this.container.lastChild)
		},
		reindentSelection : function(a) {
			if (select.somethingSelected()) {
				var c = select.selectionTopNode(this.container, true), b = select
						.selectionTopNode(this.container, false);
				c === false || b === false || this.indentRegion(c, b, a)
			} else
				this.indentAtCursor(a)
		},
		grabKeys : function(a, c) {
			this.frozen = a;
			this.keyFilter = c
		},
		ungrabKeys : function() {
			this.frozen = "leave"
		},
		setParser : function(a, c) {
			s.Parser = window[a];
			(c = c || this.options.parserConfig) && s.Parser.configure
					&& s.Parser.configure(c);
			if (this.container.firstChild) {
				forEach(this.container.childNodes, function(b) {
					if (b.nodeType != 3)
						b.dirty = true
				});
				this.addDirtyNode(this.firstChild);
				this.scheduleHighlight()
			}
		},
		keyDown : function(a) {
			if (this.frozen == "leave")
				this.keyFilter = this.frozen = null;
			if (this.frozen
					&& (!this.keyFilter || this.keyFilter(a.keyCode, a))) {
				a.stop();
				this.frozen(a)
			} else {
				var c = a.keyCode;
				this.delayScanning();
				this.options.autoMatchParens && this.scheduleParenHighlight();
				if (c == 13) {
					if (a.ctrlKey && !a.altKey)
						this.reparseBuffer();
					else {
						select.insertNewlineAtCursor();
						c = this.options.enterMode;
						if (c != "flat")
							this.indentAtCursor(c == "keep" ? "keep"
									: undefined);
						select.scrollToCursor(this.container)
					}
					a.stop()
				} else if (c == 9 && this.options.tabMode != "default"
						&& !a.ctrlKey) {
					this.handleTab(!a.shiftKey);
					a.stop()
				} else if (c == 32 && a.shiftKey
						&& this.options.tabMode == "default") {
					this.handleTab(true);
					a.stop()
				} else if (c == 36 && !a.shiftKey && !a.ctrlKey)
					this.home() && a.stop();
				else if (c == 35 && !a.shiftKey && !a.ctrlKey)
					this.end() && a.stop();
				else if (c == 33 && !a.shiftKey && !a.ctrlKey && !gecko)
					this.pageUp() && a.stop();
				else if (c == 34 && !a.shiftKey && !a.ctrlKey && !gecko)
					this.pageDown() && a.stop();
				else if ((c == 219 || c == 221) && a.ctrlKey && !a.altKey) {
					this.highlightParens(a.shiftKey, true);
					a.stop()
				} else if (a.metaKey && !a.shiftKey && (c == 37 || c == 39)) {
					var b = select.selectionTopNode(this.container);
					if (!(b === false || !this.container.firstChild)) {
						if (c == 37)
							select.focusAfterNode(m(b), this.container);
						else {
							c = n(b, this.container);
							select.focusAfterNode(c ? c.previousSibling
									: this.container.lastChild, this.container)
						}
						a.stop()
					}
				} else if ((a.ctrlKey || a.metaKey) && !a.altKey)
					if (a.shiftKey && c == 90 || c == 89) {
						select.scrollToNode(this.history.redo());
						a.stop()
					} else if (c == 90 || safari && c == 8) {
						select.scrollToNode(this.history.undo());
						a.stop()
					} else if (c == 83 && this.options.saveFunction) {
						this.options.saveFunction();
						a.stop()
					} else
						c == 86 && !mac && this.reroutePasteEvent()
			}
		},
		keyPress : function(a) {
			var c = this.options.electricChars && s.Parser.electricChars, b = this;
			if (this.frozen
					&& (!this.keyFilter || this.keyFilter(a.keyCode || a.code,
							a)) || a.code == 13 || a.code == 9
					&& this.options.tabMode != "default" || a.code == 32
					&& a.shiftKey && this.options.tabMode == "default")
				a.stop();
			else if (mac && (a.ctrlKey || a.metaKey) && a.character == "v")
				this.reroutePasteEvent();
			else if (c && c.indexOf(a.character) != -1)
				this.parent.setTimeout(function() {
					b.indentAtCursor(null)
				}, 0);
			else if (brokenOpera)
				if (a.code == 8) {
					var d = select.selectionTopNode(this.container);
					b = this;
					var e = d ? d.nextSibling : this.container.firstChild;
					d !== false
							&& e
							&& isBR(e)
							&& this.parent.setTimeout(function() {
								select.selectionTopNode(b.container) == e
										&& select.focusAfterNode(
												e.previousSibling, b.container)
							}, 20)
				} else {
					if (a.code == 46) {
						d = select.selectionTopNode(this.container);
						b = this;
						d
								&& isBR(d)
								&& this.parent.setTimeout(function() {
									select.selectionTopNode(b.container) != d
											&& select.focusAfterNode(d,
													b.container)
								}, 20)
					}
				}
			else if (slowWebkit) {
				e = (d = select.selectionTopNode(this.container)) ? d.nextSibling
						: this.container.firstChild;
				if (d && e && isBR(e) && !isBR(d)) {
					var g = document.createTextNode("\u200b");
					this.container.insertBefore(g, e);
					this.parent.setTimeout(function() {
						if (g.nodeValue == "\u200b")
							removeElement(g);
						else
							g.nodeValue = g.nodeValue.replace("\u200b", "")
					}, 20)
				}
			}
			webkit
					&& !this.options.textWrapping
					&& setTimeout(function() {
						var h = select.selectionTopNode(b.container, true);
						h
								&& h.nodeType == 3
								&& h.previousSibling
								&& isBR(h.previousSibling)
								&& h.nextSibling
								&& isBR(h.nextSibling)
								&& h.parentNode
										.replaceChild(document
												.createElement("BR"),
												h.previousSibling)
					}, 50)
		},
		keyUp : function(a) {
			this.cursorActivity(a.keyCode >= 16 && a.keyCode <= 18
					|| a.keyCode >= 33 && a.keyCode <= 40)
		},
		indentLineAfter : function(a, c) {
			function b(r) {
				r = r ? r.nextSibling : d.container.firstChild;
				if (!r || !hasClass(r, "whitespace"))
					return null;
				return r
			}
			var d = this, e = b(a), g = 0, h = e ? e.currentText.length : 0, i = e ? e.nextSibling
					: a ? a.nextSibling : this.container.firstChild;
			if (c == "keep") {
				if (a) {
					var k = b(m(a.previousSibling));
					if (k)
						g = k.currentText.length
				}
			} else {
				k = a && i && i.currentText ? i.currentText : "";
				if (c != null && this.options.tabMode == "shift")
					g = c ? h + indentUnit : Math.max(0, h - indentUnit);
				else if (a)
					g = a.indentation(k, h, c);
				else if (s.Parser.firstIndentation)
					g = s.Parser.firstIndentation(k, h, c)
			}
			h = g - h;
			if (h < 0)
				if (g == 0) {
					if (i)
						select.snapshotMove(e.firstChild, i.firstChild || i, 0);
					removeElement(e);
					e = null
				} else {
					select.snapshotMove(e.firstChild, e.firstChild, h, true);
					e.currentText = makeWhiteSpace(g);
					e.firstChild.nodeValue = e.currentText
				}
			else if (h > 0)
				if (e) {
					e.currentText = makeWhiteSpace(g);
					e.firstChild.nodeValue = e.currentText;
					select.snapshotMove(e.firstChild, e.firstChild, h, true)
				} else {
					e = makePartSpan(makeWhiteSpace(g));
					e.className = "whitespace";
					a ? insertAfter(e, a) : this.container.insertBefore(e,
							this.container.firstChild);
					select.snapshotMove(i && (i.firstChild || i), e.firstChild,
							g, false, true)
				}
			else
				e && select.snapshotMove(e.firstChild, e.firstChild, g, false);
			h != 0 && this.addDirtyNode(a)
		},
		highlightAtCursor : function() {
			var a = select.selectionTopNode(this.container, true), c = select
					.selectionTopNode(this.container, false);
			if (a === false || c === false)
				return false;
			select.markSelection();
			if (this.highlight(a, n(c, this.container), true, 20) === false)
				return false;
			select.selectMarked();
			return true
		},
		handleTab : function(a) {
			this.options.tabMode == "spaces" ? select.insertTabAtCursor()
					: this.reindentSelection(a)
		},
		home : function() {
			var a = select.selectionTopNode(this.container, true), c = a;
			if (a === false || !(!a || a.isPart || isBR(a))
					|| !this.container.firstChild)
				return false;
			for (; a && !isBR(a);)
				a = a.previousSibling;
			var b = a ? a.nextSibling : this.container.firstChild;
			b && b != c && b.isPart && hasClass(b, "whitespace") ? select
					.focusAfterNode(b, this.container) : select.focusAfterNode(
					a, this.container);
			select.scrollToCursor(this.container);
			return true
		},
		end : function() {
			var a = select.selectionTopNode(this.container, true);
			if (a === false)
				return false;
			a = n(a, this.container);
			if (!a)
				return false;
			select.focusAfterNode(a.previousSibling, this.container);
			select.scrollToCursor(this.container);
			return true
		},
		pageUp : function() {
			var a = this.cursorPosition().line, c = this.visibleLineCount();
			if (a === false || c === false)
				return false;
			c -= 2;
			for ( var b = 0; b < c; b++) {
				a = this.prevLine(a);
				if (a === false)
					break
			}
			if (b == 0)
				return false;
			select.setCursorPos(this.container, {
				node : a,
				offset : 0
			});
			select.scrollToCursor(this.container);
			return true
		},
		pageDown : function() {
			var a = this.cursorPosition().line, c = this.visibleLineCount();
			if (a === false || c === false)
				return false;
			c -= 2;
			for ( var b = 0; b < c; b++) {
				var d = this.nextLine(a);
				if (d === false)
					break;
				a = d
			}
			if (b == 0)
				return false;
			select.setCursorPos(this.container, {
				node : a,
				offset : 0
			});
			select.scrollToCursor(this.container);
			return true
		},
		scheduleParenHighlight : function() {
			this.parenEvent && this.parent.clearTimeout(this.parenEvent);
			var a = this;
			this.parenEvent = this.parent.setTimeout(function() {
				a.highlightParens()
			}, 300)
		},
		highlightParens : function(a, c) {
			function b(q, x) {
				if (q)
					if (h.options.markParen)
						h.options.markParen(q, x);
					else {
						q.style.fontWeight = "bold";
						q.style.color = x ? "#8F8" : "#F88"
					}
			}
			function d(q) {
				if (q)
					if (h.options.unmarkParen)
						h.options.unmarkParen(q);
					else {
						q.style.fontWeight = "";
						q.style.color = ""
					}
			}
			function e(q) {
				if (q.currentText)
					return (q = q.currentText
							.match(/^[\s\u00a0]*([\(\)\[\]{}])[\s\u00a0]*$/))
							&& q[1]
			}
			function g() {
				for ( var q = [], x, y = true, v = k; v; v = u ? v.nextSibling
						: v.previousSibling)
					if (v.className == r && isSpan(v) && (x = e(v))) {
						if (/[\(\[\{]/.test(x) == u)
							q.push(x);
						else if (q.length) {
							if (q.pop() != matching[x])
								y = false
						} else
							y = false;
						if (!q.length)
							break
					} else if (v.dirty || !isSpan(v) && !isBR(v))
						return {
							node : v,
							status : "dirty"
						};
				return {
					node : v,
					status : v && y
				}
			}
			var h = this;
			if (!c && h.highlighted) {
				d(h.highlighted[0]);
				d(h.highlighted[1])
			}
			if (!(!window || !window.parent || !window.select)) {
				this.parenEvent && this.parent.clearTimeout(this.parenEvent);
				this.parenEvent = null;
				var i, k = select.selectionTopNode(this.container, true);
				if (k && this.highlightAtCursor())
					if ((k = select.selectionTopNode(this.container, true))
							&& ((i = e(k)) || (k = k.nextSibling) && (i = e(k))))
						for ( var r = k.className, u = /[\(\[\{]/.test(i);;) {
							var t = g();
							if (t.status == "dirty") {
								this.highlight(t.node, n(t.node));
								t.node.dirty = false
							} else {
								b(k, t.status);
								b(t.node, t.status);
								if (c)
									h.parent.setTimeout(function() {
										d(k);
										d(t.node)
									}, 500);
								else
									h.highlighted = [ k, t.node ];
								a
										&& t.node
										&& select.focusAfterNode(
												t.node.previousSibling,
												this.container);
								break
							}
						}
			}
		},
		indentAtCursor : function(a) {
			if (this.container.firstChild)
				if (this.highlightAtCursor()) {
					var c = select.selectionTopNode(this.container, false);
					if (c !== false) {
						select.markSelection();
						this.indentLineAfter(m(c), a);
						select.selectMarked()
					}
				}
		},
		indentRegion : function(a, c, b) {
			var d = a = m(a), e = a && m(a.previousSibling);
			isBR(c) || (c = n(c, this.container));
			this.addDirtyNode(a);
			do {
				var g = n(d, this.container);
				d && this.highlight(e, g, true);
				this.indentLineAfter(d, b);
				e = d;
				d = g
			} while (d != c);
			select.setCursorPos(this.container, {
				node : a,
				offset : 0
			}, {
				node : c,
				offset : 0
			})
		},
		cursorActivity : function(a) {
			if (this.unloaded) {
				window.document.designMode = "off";
				window.document.designMode = "on";
				this.unloaded = false
			}
			if (internetExplorer) {
				this.container.createTextRange().execCommand("unlink");
				clearTimeout(this.saveSelectionSnapshot);
				var c = this;
				this.saveSelectionSnapshot = setTimeout(function() {
					var e = select.getBookmark(c.container);
					if (e)
						c.selectionSnapshot = e
				}, 200)
			}
			var b = this.options.onCursorActivity;
			if (!a || b) {
				var d = select.selectionTopNode(this.container, false);
				if (!(d === false || !this.container.firstChild)) {
					d = d || this.container.firstChild;
					b && b(d);
					if (!a) {
						this.scheduleHighlight();
						this.addDirtyNode(d)
					}
				}
			}
		},
		reparseBuffer : function() {
			forEach(this.container.childNodes, function(a) {
				a.dirty = true
			});
			this.container.firstChild
					&& this.addDirtyNode(this.container.firstChild)
		},
		addDirtyNode : function(a) {
			if (a = a || this.container.firstChild) {
				for ( var c = 0; c < this.dirty.length; c++)
					if (this.dirty[c] == a)
						return;
				if (a.nodeType != 3)
					a.dirty = true;
				this.dirty.push(a)
			}
		},
		allClean : function() {
			return !this.dirty.length
		},
		scheduleHighlight : function() {
			var a = this;
			this.parent.clearTimeout(this.highlightTimeout);
			this.highlightTimeout = this.parent.setTimeout(function() {
				a.highlightDirty()
			}, this.options.passDelay)
		},
		getDirtyNode : function() {
			for (; this.dirty.length > 0;) {
				var a = this.dirty.pop();
				try {
					for (; a && a.parentNode != this.container;)
						a = a.parentNode;
					if (a && (a.dirty || a.nodeType == 3))
						return a
				} catch (c) {
				}
			}
			return null
		},
		highlightDirty : function(a) {
			if (!window || !window.parent || !window.select)
				return false;
			this.options.readOnly || select.markSelection();
			for ( var c, b = a ? null : (new Date).getTime()
					+ this.options.passTime; ((new Date).getTime() < b || a)
					&& (c = this.getDirtyNode());) {
				var d = this.highlight(c, b);
				d && d.node && d.dirty && this.addDirtyNode(d.node.nextSibling)
			}
			this.options.readOnly || select.selectMarked();
			c && this.scheduleHighlight();
			return this.dirty.length == 0
		},
		documentScanner : function(a) {
			var c = this, b = null;
			return function() {
				if (!(!window || !window.parent || !window.select)) {
					if (b && b.parentNode != c.container)
						b = null;
					select.markSelection();
					var d = c.highlight(b, (new Date).getTime() + a, true);
					select.selectMarked();
					d = d ? d.node && d.node.nextSibling : null;
					b = b == d ? null : d;
					c.delayScanning()
				}
			}
		},
		delayScanning : function() {
			if (this.scanner) {
				this.parent.clearTimeout(this.documentScan);
				this.documentScan = this.parent.setTimeout(this.scanner,
						this.options.continuousScanning)
			}
		},
		highlight : function(a, c, b, d) {
			function e(v) {
				if (v) {
					var w = v.oldNextSibling;
					if (q || w === undefined || v.nextSibling != w)
						h.history.touch(v);
					v.oldNextSibling = v.nextSibling
				} else {
					w = h.container.oldFirstChild;
					if (q || w === undefined || h.container.firstChild != w)
						h.history.touch(null);
					h.container.oldFirstChild = h.container.firstChild
				}
			}
			var g = this.container, h = this, i = this.options.activeTokens, k = typeof c == "number" ? c
					: null;
			if (!g.firstChild)
				return false;
			for (; a && (!a.parserFromHere || a.dirty);) {
				if (d != null && isBR(a) && --d < 0)
					return false;
				a = a.previousSibling
			}
			if (a && !a.nextSibling)
				return false;
			var r = j(a ? a.nextSibling : g.firstChild);
			d = stringStream(r);
			var u = a ? a.parserFromHere(d) : s.Parser.make(d), t = {
				current : null,
				get : function() {
					if (!this.current)
						this.current = r.nodes.shift();
					return this.current
				},
				next : function() {
					this.current = null
				},
				remove : function() {
					g.removeChild(this.get());
					this.current = null
				},
				getNonEmpty : function() {
					for ( var v = this.get(); v && isSpan(v)
							&& v.currentText == "";)
						if (window.opera
								&& (v.previousSibling == null || isBR(v.previousSibling))
								&& (v.nextSibling == null || isBR(v.nextSibling))) {
							this.next();
							v = this.get()
						} else {
							var w = v;
							this.remove();
							v = this.get();
							select.snapshotMove(w.firstChild, v
									&& (v.firstChild || v), 0)
						}
					return v
				}
			}, q = false, x = true, y = 0;
			forEach(u, function(v) {
				var w = t.getNonEmpty();
				if (v.value == "\n") {
					if (!isBR(w))
						throw "Parser out of sync. Expected BR.";
					if (w.dirty || !w.indentation)
						q = true;
					e(a);
					a = w;
					w.parserFromHere = u.copy();
					w.indentation = v.indentation || alwaysZero;
					w.dirty = false;
					if (k == null && w == c)
						throw StopIteration;
					if (k != null && (new Date).getTime() >= k || !q && !x
							&& y > 1 && !b)
						throw StopIteration;
					x = q;
					q = false;
					y = 0;
					t.next()
				} else {
					if (!isSpan(w))
						throw "Parser out of sync. Expected SPAN.";
					if (w.dirty)
						q = true;
					y++;
					if (!w.reduced && w.currentText == v.value
							&& w.className == v.style) {
						w.dirty = false;
						t.next()
					} else {
						q = true;
						var z = makePartSpan(v.value);
						z.className = v.style;
						g.insertBefore(z, w);
						i && i(z, v, h);
						v = v.value.length;
						for ( var B = 0; v > 0;) {
							w = t.get();
							var A = w.currentText.length;
							select.snapshotReplaceNode(w.firstChild,
									z.firstChild, v, B);
							if (A > v) {
								w = w;
								w.currentText = w.currentText.substring(v);
								w.reduced = true;
								v = 0
							} else {
								v -= A;
								B += A;
								t.remove()
							}
						}
					}
				}
			});
			e(a);
			webkitLastLineHack(this.container);
			return {
				node : t.getNonEmpty(),
				dirty : q
			}
		}
	};
	return s
}();
addEventHandler(window, "load", function() {
	var f = window.frameElement.CodeMirror;
	f.editor = new Editor(f.options);
	this.parent.setTimeout(method(f, "init"), 0)
});
function tokenizer(f, l) {
	function j(n) {
		return n != "\n" && /^[\s\u00a0]*$/.test(n)
	}
	var m = {
		state : l,
		take : function(n) {
			if (typeof n == "string")
				n = {
					style : n,
					type : n
				};
			n.content = (n.content || "") + f.get();
			/\n$/.test(n.content) || f.nextWhile(j);
			n.value = n.content + f.get();
			return n
		},
		next : function() {
			if (!f.more())
				throw StopIteration;
			var n;
			if (f.equals("\n")) {
				f.next();
				return this.take("whitespace")
			}
			if (f.applies(j))
				n = "whitespace";
			else
				for (; !n;)
					n = this.state(f, function(o) {
						m.state = o
					});
			return this.take(n)
		}
	};
	return m
};
var SparqlParser = Editor.Parser = function() {
	function f(o) {
		return function(s) {
			s = s && s.charAt(0);
			if (/[\]\}]/.test(s))
				for (; o && o.type == "pattern";)
					o = o.prev;
			s = o && s == matching[o.type];
			return o ? o.type == "pattern" ? o.col : o.align ? o.col
					- (s ? o.width : 0) : o.indent + (s ? 0 : indentUnit) : 0
		}
	}
	var l = /^(?:str|lang|langmatches|datatype|bound|sameterm|isiri|isuri|isblank|isliteral|union|a)$/i, j = RegExp(
			"^(?:base|prefix|select|distinct|reduced|construct|describe|ask|from|named|where|order|limit|offset|filter|optional|graph|by|asc|desc)$",
			"i"), m = /[*+\-<>=&|]/, n = function() {
		function o(p, a) {
			var c = p.next();
			if (c == "$" || c == "?") {
				p.nextWhileMatches(/[\w\d]/);
				return "sp-var"
			} else if (c == "<" && !p.matches(/[\s\u00a0=]/)) {
				p.nextWhileMatches(/[^\s\u00a0>]/);
				p.equals(">") && p.next();
				return "sp-uri"
			} else if (c == '"' || c == "'") {
				a(s(c));
				return null
			} else if (/[{}\(\),\.;\[\]]/.test(c))
				return "sp-punc";
			else if (c == "#") {
				for (; !p.endOfLine();)
					p.next();
				return "sp-comment"
			} else if (m.test(c)) {
				p.nextWhileMatches(m);
				return "sp-operator"
			} else if (c == ":") {
				p.nextWhileMatches(/[\w\d\._\-]/);
				return "sp-prefixed"
			} else {
				p.nextWhileMatches(/[_\w\d]/);
				if (p.equals(":")) {
					p.next();
					p.nextWhileMatches(/[\w\d_\-]/);
					return "sp-prefixed"
				}
				c = p.get();
				return {
					style : l.test(c) ? "sp-operator"
							: j.test(c) ? "sp-keyword" : "sp-word",
					content : c
				}
			}
		}
		function s(p) {
			return function(a, c) {
				for ( var b = false; !a.endOfLine();) {
					var d = a.next();
					if (d == p && !b) {
						c(o);
						break
					}
					b = !b && d == "\\"
				}
				return "sp-literal"
			}
		}
		return function(p, a) {
			return tokenizer(p, a || o)
		}
	}();
	return {
		make : function(o) {
			function s(e, g) {
				a = {
					prev : a,
					indent : c,
					col : b,
					type : e,
					width : g
				}
			}
			var p = n(o), a = null, c = 0, b = 0, d = {
				next : function() {
					var e = p.next(), g = e.style, h = e.content, i = e.value.length;
					if (h == "\n") {
						e.indentation = f(a);
						c = b = 0;
						if (a && a.align == null)
							a.align = false
					} else if (g == "whitespace" && b == 0)
						c = i;
					else if (g != "sp-comment" && a && a.align == null)
						a.align = true;
					if (h != "\n")
						b += i;
					if (/[\[\{\(]/.test(h))
						s(h, i);
					else if (/[\]\}\)]/.test(h)) {
						for (; a && a.type == "pattern";)
							a = a.prev;
						if (a && h == matching[a.type])
							a = a.prev
					} else if (h == "." && a && a.type == "pattern")
						a = a.prev;
					else if ((g == "sp-word" || g == "sp-prefixed"
							|| g == "sp-uri" || g == "sp-var" || g == "sp-literal")
							&& a && /[\{\[]/.test(a.type))
						s("pattern", i);
					return e
				},
				copy : function() {
					var e = a, g = c, h = b, i = p.state;
					return function(k) {
						p = n(k, i);
						a = e;
						c = g;
						b = h;
						return d
					}
				}
			};
			return d
		},
		electricChars : "}]"
	}
}();