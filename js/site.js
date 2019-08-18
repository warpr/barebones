document.addEventListener("DOMContentLoaded", function() {

  // Variables
  var	navOffsetTop = document.querySelector('.navbar').getBoundingClientRect().top + document.body.scrollTop;
	var	entityMap = {
					"&": "&amp;",
					"<": "&lt;",
					">": "&gt;",
					'"': '&quot;',
					"'": '&#39;',
					"/": '&#x2F;'
				};

  function init() {  	
  	// handle menu popovers
  	var y = document.querySelectorAll('[data-popover]')
  	y.forEach(function(e) {
  		e.addEventListener('click', newOpenPopover)
  	})
  	document.addEventListener('click', newClosePopover)

		// attach click even to all anchor links
		addSmoothScroll();
		
		// add click event to theme buttons
		var x = document.querySelector('.themeButtons')
		x.childNodes.forEach(function(e) {
			e.addEventListener('click', toggleTheme)
		})
		
		// listener for navbar visibility
    window.addEventListener('scroll', onScroll);
    
    // prep for html escaping
    buildSnippets();
  }

  /* non-jquery functions */
	
	function toggleTheme(e) {
		var target = e.target
		// check if button pressed was already primary
		if (!target.classList.contains('button-primary')) {
			// get sibling, which might be before
			var sib = target.nextElementSibling || target.previousElementSibling
			target.classList.add('button-primary')
			sib.classList.remove('button-primary')
			
			var prettifyDark = document.getElementById('prettify-dark')
			var sheets = document.styleSheets
			
			// temporariily set transition class on html element
			document.documentElement.classList.add('transition-theme')
			
			// change data-theme
			if (target.classList.contains('darkTheme')) {
				document.documentElement.setAttribute("data-theme", "dark")
				prettifyDark.removeAttribute('disabled')
				prettifyDark.disabled = false
			} else {
				document.documentElement.removeAttribute("data-theme", "dark")
				prettifyDark.disabled = true
			}
			
			// remove transition class
			window.setTimeout(function() {
				document.documentElement.classList.remove('transition-theme')
			}, 1000)
		}
	}
	
	function addSmoothScroll() {
		var els = document.querySelectorAll('[href^="#"]')
		els.forEach(function(e) {
			e.addEventListener('click', function(i) {
				i.preventDefault()
				var target = e.getAttribute('href')
				document.getElementById(target.substring(1)).scrollIntoView({ behavior: 'smooth' });
			});
		});
	}
	
  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }
  
  function buildSnippets() {
  	var els = document.querySelectorAll('.code-example-body')
  	els.forEach(function(e) {
      var newContent = escapeHtml(e.innerHTML)
      e.innerHTML = newContent
  	})
  }
  
  function newOpenPopover(e) {
    e.preventDefault()
    newClosePopover();
    var pop = e.target.getAttribute('data-popover')
    var popoverEl = document.getElementById(pop)
    //var popover = $($(this).data('popover'));
    popoverEl.classList.add('open')
    e.stopImmediatePropagation();
  }

  function newClosePopover(e) {
  	var x = document.querySelector('.popover.open')
    if(x != null) {
      x.classList.remove('open')
    }
  }
  
  window.onresize = function() {
  	document.body.classList.remove('has-docked-nav')
  	var rect = document.querySelector('.navbar').getBoundingClientRect();
  	navOffsetTop = rect.top + document.body.scrollTop
  	onScroll()
  }

	function onScroll() {
  	var b = document.body
    if(navOffsetTop < window.scrollY && !b.classList.contains('has-docked-nav')) {
      b.classList.add('has-docked-nav')
    }
    if(navOffsetTop > window.scrollY && b.classList.contains('has-docked-nav')) {
      b.classList.remove('has-docked-nav')
    }
  }

  init();
});