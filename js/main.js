!function(l,r){function d(){}function h(t){var e,i=t.offsetLeft,s=t.offsetTop;return t.offsetParent&&(i+=(e=arguments.callee(t.offsetParent)).x,s+=e.y),{x:i,y:s}}function s(){return r.documentElement.scrollTop||r.body.scrollTop}var t,f=r.body,u=r.querySelector.bind(r),n=r.querySelectorAll.bind(r),o=u("html"),e=u("#gotop"),a=u("#menu"),m=u("#header"),c=u("#mask"),v=u("#menu-toggle"),g=u("#menu-off"),p=u("#loading"),L=l.requestAnimationFrame,y=Array.prototype.forEach,w="ontouchstart"in l&&/Mobile|Android|iOS|iPhone|iPad|iPod|Windows Phone|KFAPWI/i.test(navigator.userAgent)?"touchstart":"click",x=/micromessenger/i.test(navigator.userAgent),$={goTop:function(t){var e=s(),i=2<arguments.length?arguments[1]:Math.abs(e-t)/12;e&&t<e?(l.scrollTo(0,Math.max(e-i,0)),L(arguments.callee.bind(this,t,i))):t&&e<t?(l.scrollTo(0,Math.min(e+i,t)),L(arguments.callee.bind(this,t,i))):this.toc.actived(t)},toggleGotop:function(t){t>l.innerHeight/2?e.classList.add("in"):e.classList.remove("in")},toggleMenu:function(t){var e,i=u("#main");t?(a.classList.remove("hide"),l.innerWidth<1241&&(c.classList.add("in"),a.classList.add("show"),x?(e=s(),i.classList.add("lock"),i.scrollTop=e):o.classList.add("lock"))):(a.classList.remove("show"),c.classList.remove("in"),x?(e=i.scrollTop,i.classList.remove("lock"),l.scrollTo(0,e)):o.classList.remove("lock"))},fixedHeader:function(t){t>m.clientHeight?m.classList.add("fixed"):m.classList.remove("fixed")},toc:function(){var n=u("#post-toc");if(!n||!n.children.length)return{fixed:d,actived:d};var e=u(".post-header").clientHeight,o=m.clientHeight,a=u("#post-content").querySelectorAll("h1, h2, h3, h4, h5, h6");n.querySelector('a[href="#'+a[0].id+'"]').parentNode.classList.add("active");var t=n.querySelectorAll(".post-toc-child");for(i=0,len=t.length;i<len;i++)t[i].classList.add("post-toc-shrink");var s=n.querySelector('a[href="#'+a[0].id+'"]').nextElementSibling;s&&(s.classList.add("post-toc-expand"),s.classList.remove("post-toc-shrink")),n.classList.remove("post-toc-shrink");function c(t,e){t.classList.remove("active"),e.classList.add("active");var i=e.parentElement.querySelectorAll(".post-toc-child");for(j=0,len1=i.length;j<len1;j++)i[j].classList.remove("post-toc-expand"),i[j].classList.add("post-toc-shrink");(e=e.querySelector(".post-toc-child"))&&(e.classList.remove("post-toc-shrink"),e.classList.add("post-toc-expand"))}return{fixed:function(t){e-o<=t?n.classList.add("fixed"):n.classList.remove("fixed")},actived:function(t){for(i=0,len=a.length;i<len;i++){var e,s;t>h(a[i]).y-o-5&&(e=n.querySelector("li.active"),s=n.querySelector('a[href="#'+a[i].id+'"]').parentNode,c(e,s))}t<h(a[0]).y&&c(n.querySelector("li.active"),n.querySelector('a[href="#'+a[0].id+'"]').parentNode)}}}(),hideOnMask:[],modal:function(t){this.$modal=u(t),this.$off=this.$modal.querySelector(".close");var e=this;this.show=function(){c.classList.add("in"),e.$modal.classList.add("ready"),setTimeout(function(){e.$modal.classList.add("in")},0)},this.onHide=d,this.hide=function(){e.onHide(),c.classList.remove("in"),e.$modal.classList.remove("in"),setTimeout(function(){e.$modal.classList.remove("ready")},300)},this.toggle=function(){return e.$modal.classList.contains("in")?e.hide():e.show()},$.hideOnMask.push(this.hide),this.$off&&this.$off.addEventListener(w,this.hide)},share:function(){var e=u("#pageShare"),i=u("#shareFab"),t=new this.modal("#globalShare");u("#menuShare").addEventListener(w,t.toggle),i&&(i.addEventListener(w,function(){e.classList.toggle("in")},!1),r.addEventListener(w,function(t){i.contains(t.target)||e.classList.remove("in")},!1));var s=new this.modal("#wxShare");s.onHide=t.hide,y.call(n(".wxFab"),function(t){t.addEventListener(w,s.toggle)})},search:function(){var t=u("#search-wrap");u("#search").addEventListener(w,function(){t.classList.toggle("in")})},reward:function(){var t=new this.modal("#reward");u("#rewardBtn").addEventListener(w,t.toggle);var t=u("#rewardToggle"),e=u("#rewardCode");t&&t.addEventListener("change",function(){e.src=this.checked?this.dataset.alipay:this.dataset.wechat})},waterfall:function(){l.innerWidth<760||y.call(n(".waterfall"),function(t){var e=t.querySelectorAll(".waterfall-item"),i=[0,0];y.call(e,function(t){var e=i[0]<=i[1]?0:1;t.style.cssText="top:"+i[e]+"px;left:"+(0<e?"50%":0),i[e]+=t.offsetHeight}),t.style.height=Math.max(i[0],i[1])+"px",t.classList.add("in")})},tabBar:function(t){t.parentNode.parentNode.classList.toggle("expand")},page:(t=n(".fade, .fade-scale"),{loaded:function(){y.call(t,function(t){t.classList.add("in")}),0},unload:function(){y.call(t,function(t){t.classList.remove("in")}),0},visible:!1}),lightbox:void y.call(n(".img-lightbox"),function(t){new E(t)}),loadScript:function(t){t.forEach(function(t){var e=r.createElement("script");e.src=t,e.async=!0,f.appendChild(e)})}};function E(t){var s,n,o,a,c;this.$img=t.querySelector("img"),this.$overlay=t.querySelector("overlay"),this.margin=40,this.title=this.$img.title||this.$img.alt||"",this.isZoom=!1,this.calcRect=function(){a=f.clientWidth;var t=(c=f.clientHeight)-2*this.margin,e=s,i=n,t=(this.margin,Math.min(a<e?a/e:1,t<i?t/i:1));return{w:e*=t,h:i*=t,t:(c-i)/2-o.top,l:(a-e)/2-o.left+this.$img.offsetLeft}},this.setImgRect=function(t){this.$img.style.cssText="width: "+t.w+"px; max-width: "+t.w+"px; height:"+t.h+"px; top: "+t.t+"px; left: "+t.l+"px"},this.setFrom=function(){this.setImgRect({w:o.width,h:o.height,t:0,l:(t.offsetWidth-o.width)/2})},this.setTo=function(){this.setImgRect(this.calcRect())},this.addTitle=function(){this.title&&(this.$caption=r.createElement("div"),this.$caption.innerHTML=this.title,this.$caption.className="overlay-title",t.appendChild(this.$caption))},this.removeTitle=function(){this.$caption&&t.removeChild(this.$caption)};var e=this;this.zoomIn=function(){s=this.$img.naturalWidth||this.$img.width,n=this.$img.naturalHeight||this.$img.height,o=this.$img.getBoundingClientRect(),t.style.height=o.height+"px",t.classList.add("ready"),this.setFrom(),this.addTitle(),this.$img.classList.add("zoom-in"),setTimeout(function(){t.classList.add("active"),e.setTo(),e.isZoom=!0},0)},this.zoomOut=function(){this.isZoom=!1,t.classList.remove("active"),this.$img.classList.add("zoom-in"),this.setFrom(),setTimeout(function(){e.$img.classList.remove("zoom-in"),e.$img.style.cssText="",e.removeTitle(),t.classList.remove("ready"),t.removeAttribute("style")},300)},t.addEventListener("click",function(t){e.isZoom?e.zoomOut():"IMG"===t.target.tagName&&e.zoomIn()}),r.addEventListener("scroll",function(){e.isZoom&&e.zoomOut()}),l.addEventListener("resize",function(){e.isZoom&&e.zoomOut()})}l.addEventListener("load",function(){p.classList.remove("active"),$.page.loaded(),l.lazyScripts&&l.lazyScripts.length&&$.loadScript(l.lazyScripts)}),l.addEventListener("DOMContentLoaded",function(){$.waterfall();var t=s();$.toc.fixed(t),$.toc.actived(t),$.page.loaded()});var S=!1,T=u('a[href^="mailto"]');T&&T.addEventListener(w,function(){S=!0}),l.addEventListener("beforeunload",function(t){S?S=!1:$.page.unload()}),l.addEventListener("pageshow",function(){$.page.visible||$.page.loaded()}),l.addEventListener("resize",function(){l.BLOG.even=w="ontouchstart"in l?"touchstart":"click",$.toggleMenu(),$.waterfall()}),e.addEventListener(w,function(){L($.goTop.bind($,0))},!1),v.addEventListener(w,function(t){$.toggleMenu(!0),t.preventDefault()},!1),g.addEventListener(w,function(){a.classList.add("hide")},!1),c.addEventListener(w,function(t){$.toggleMenu(),$.hideOnMask.forEach(function(t){t()}),t.preventDefault()},!1),r.addEventListener("scroll",function(){var t=s();$.toggleGotop(t),$.fixedHeader(t),$.toc.fixed(t),$.toc.actived(t)},!1),l.BLOG.SHARE&&$.share(),l.BLOG.REWARD&&$.reward(),$.noop=d,$.even=w,$.$=u,$.$$=n,Object.keys($).reduce(function(t,e){return t[e]=$[e],t},l.BLOG),l.Waves?(Waves.init(),Waves.attach(".global-share li",["waves-block"]),Waves.attach(".article-tag-list-link, #page-nav a, #page-nav span",["waves-button"])):console.error("Waves loading failed.")}(window,document);