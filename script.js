(function(){
var d=document.documentElement,mq=matchMedia('(prefers-color-scheme: dark)');
function set(t){d.setAttribute('data-theme',t)}
var s=null;try{s=localStorage.getItem('theme')}catch(e){}
set(s||(mq.matches?'dark':'light'));
mq.addEventListener&&mq.addEventListener('change',function(e){var k=null;try{k=localStorage.getItem('theme')}catch(x){}if(!k)set(e.matches?'dark':'light')});
document.querySelector('.tt').addEventListener('click',function(){var n=d.getAttribute('data-theme')==='dark'?'light':'dark';set(n);try{localStorage.setItem('theme',n)}catch(e){}});
var h=document.querySelector('header'),b=document.querySelector('.bg');
b.addEventListener('click',function(){var o=h.classList.toggle('open');b.setAttribute('aria-expanded',o)});
function sc(){h.classList.toggle('solid',scrollY>40)}sc();addEventListener('scroll',sc,{passive:true});
document.getElementById('y').textContent=new Date().getFullYear();
})();
