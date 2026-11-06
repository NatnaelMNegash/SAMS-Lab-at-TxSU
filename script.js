document.querySelector('.menu')?.addEventListener('click',()=>document.querySelector('nav').classList.toggle('open'));document.querySelectorAll('nav a').forEach(a=>{if(a.getAttribute('href')===location.pathname.split('/').pop()||(!location.pathname.split('/').pop()&&a.getAttribute('href')==='index.html'))a.classList.add('active')});
/* Research Areas slideshow: side peeks, auto-advance + manual arrows/dots */
(function(){
  var c=document.querySelector('.ra-carousel'); if(!c) return;
  var slides=[].slice.call(c.querySelectorAll('.ra-slide')), dotsBox=c.querySelector('.ra-dots'),
      i=0, timer=null, n=slides.length, dots=[], offs=slides.map(function(){return null;}), INTERVAL=3500;
  for(var k=0;k<n;k++){(function(k){var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Show research area '+(k+1));b.addEventListener('click',function(){go(k);restart();});dotsBox.appendChild(b);dots.push(b);})(k);}
  function rel(j){var d=((j-i)%n+n)%n; if(d>n/2) d-=n; return d;} // shortest wrap-around offset
  function layout(){
    slides.forEach(function(sl,j){
      var o=rel(j), prev=offs[j];
      var jump=prev!==null && Math.abs(o-prev)>1;           // wrapping slide: reposition without flying across
      if(jump){sl.classList.add('no-anim');}
      sl.style.setProperty('--o',o);
      sl.classList.toggle('is-active',o===0);
      sl.style.visibility=Math.abs(o)>1?'hidden':'visible';
      if(jump){void sl.offsetWidth;sl.classList.remove('no-anim');}
      offs[j]=o;
    });
    dots.forEach(function(d,j){d.classList.toggle('active',j===i);});
  }
  function go(x){i=((x%n)+n)%n;layout();}
  function start(){stop();timer=setInterval(function(){go(i+1);},INTERVAL);}
  function stop(){if(timer){clearInterval(timer);timer=null;}}
  function restart(){start();}
  c.querySelector('.ra-prev').addEventListener('click',function(){go(i-1);restart();});
  c.querySelector('.ra-next').addEventListener('click',function(){go(i+1);restart();});
  slides.forEach(function(sl,j){sl.addEventListener('click',function(e){if(j!==i){e.preventDefault();go(j);restart();}});}); // click a side card to bring it forward
  c.addEventListener('mouseenter',stop); c.addEventListener('mouseleave',start);
  c.addEventListener('focusin',stop); c.addEventListener('focusout',start);
  var sx=null;
  c.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;},{passive:true});
  c.addEventListener('touchend',function(e){if(sx===null)return;var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>40){go(i+(dx<0?1:-1));restart();}sx=null;});
  go(0); start();
})();

/* Rotating news cards in the home hero: loops continuously, pauses on hover/focus */
(function(){
  var track=document.querySelector('.news-track'); if(!track) return;
  var items=[].slice.call(track.children), n=items.length;
  if(n<2) return;
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // clone every card once, so the loop never shows a gap
  items.forEach(function(el){var c=el.cloneNode(true);c.setAttribute('aria-hidden','true');track.appendChild(c);});
  var idx=0, timer=null, GAP=16;
  function step(){var f=track.children[0];return f.getBoundingClientRect().width+GAP;}
  function perView(){var w=track.parentElement.clientWidth-24;var cw=track.children[0].getBoundingClientRect().width+GAP;return Math.max(1,Math.round((w+GAP)/cw));}
  function show(anim){track.classList.toggle('no-anim',!anim);track.style.transform='translateX(-'+(idx*step())+'px)';if(!anim){void track.offsetWidth;track.classList.remove('no-anim');}}
  function next(){
    idx++; show(true);
    if(idx>=n){ // reached the clones: after the slide finishes, snap back to the start invisibly
      setTimeout(function(){idx=0;show(false);},650);
    }
  }
  function start(){stop();timer=setInterval(next,3000);}
  function stop(){if(timer){clearInterval(timer);timer=null;}}
  var box=track.parentElement;
  box.addEventListener('mouseenter',stop);box.addEventListener('mouseleave',start);
  box.addEventListener('focusin',stop);box.addEventListener('focusout',start);
  window.addEventListener('resize',function(){show(false);});
  start();
})();
