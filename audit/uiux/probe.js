/* Probe UIUX landing olano — hasil JSON ke <pre id="__probe"> (dibaca via --dump-dom) */
(function(){
  function $(s){return document.querySelector(s)}
  function $$(s){return Array.prototype.slice.call(document.querySelectorAll(s))}
  function rect(el){var r=el.getBoundingClientRect();return{top:+(r.top+window.scrollY).toFixed(1),left:+r.left.toFixed(1),w:+r.width.toFixed(1),h:+r.height.toFixed(1)}}
  function lines(el){var lh=parseFloat(getComputedStyle(el).lineHeight);if(!lh)return null;return Math.round(el.getBoundingClientRect().height/lh)}
  var out={};
  out.viewport={w:window.innerWidth,h:window.innerHeight,dpr:window.devicePixelRatio};
  out.scrollHeight=Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);
  out.hOverflow={scrollW:document.documentElement.scrollWidth,innerW:window.innerWidth,overflow:document.documentElement.scrollWidth>window.innerWidth};

  /* L1 ticker */
  var ticker=document.getElementById('ticker');
  if(ticker){
    var tt=ticker.querySelector('.ticker-text'),tx=document.getElementById('ticker-x');
    out.ticker={hidden:ticker.hidden,role:ticker.getAttribute('role'),ariaLabel:ticker.getAttribute('aria-label'),
      text:tt?tt.textContent.trim():null,facts:tt?tt.textContent.split('\u00b7').length:0,
      box:rect(ticker),textLines:tt?lines(tt):null,textFontSize:tt?getComputedStyle(tt).fontSize:null,
      textWhite:tt?getComputedStyle(tt).whiteSpace:null,
      closeBtn:tx?(function(){var r=rect(tx);r.ariaLabel=tx.getAttribute('aria-label');return r})():null};
    var before={mainTop:rect(document.querySelector('main')).top,scrollH:document.documentElement.scrollHeight};
    if(tx)tx.click();
    var after={mainTop:rect(document.querySelector('main')).top,scrollH:document.documentElement.scrollHeight};
    out.tickerClose={before:before,after:after,shiftPx:+(before.mainTop-after.mainTop).toFixed(1),
      hiddenAfter:ticker.hidden,transition:getComputedStyle(ticker).transitionDuration};
  }

  /* L3 header buttons */
  out.headerButtons=$$('.nav-cta a').map(function(a){return{text:a.textContent.trim(),href:a.getAttribute('href'),visible:a.offsetParent!==null}});
  out.burgerVisible=$('.nav-burger')?$('.nav-burger').offsetParent!==null:null;

  /* L4 nav list diff */
  var dds=$$('.nav-links .dd');
  out.desktopNav={
    produk:dds[0]?$$('.nav-links .dd')[0].querySelectorAll('.dd-menu a').length?Array.prototype.map.call(dds[0].querySelectorAll('.dd-menu a'),function(a){return a.textContent.trim()+' -> '+a.getAttribute('href')}):[]:[],
    kalkulator:dds[1]?Array.prototype.map.call(dds[1].querySelectorAll('.dd-menu a'),function(a){return a.textContent.trim()+' -> '+a.getAttribute('href')}):[],
    plain:$$('.nav-links > a').map(function(a){return a.textContent.trim()+' -> '+a.getAttribute('href')})};
  out.mobileNav=$$('.nav-mobile a').map(function(a){return a.textContent.trim()+' -> '+a.getAttribute('href')});
  out.mobileLinkHeights=$$('.nav-mobile a').slice(0,4).map(function(a){return +a.getBoundingClientRect().height.toFixed(1)});

  /* L8 H1 + hero */
  var h1=document.querySelector('.hero h1');
  if(h1){var hc=getComputedStyle(h1);
    out.h1={text:h1.textContent.trim(),words:h1.textContent.trim().split(/\s+/).length,
      fontSize:hc.fontSize,lineHeight:hc.lineHeight,box:rect(h1),lines:lines(h1)};}
  var cta=document.querySelector('.hero .cta-row .btn');
  if(cta){var cr=rect(cta);cr.href=cta.getAttribute('href');cr.text=cta.textContent.trim();
    cr.heightPx=+cta.getBoundingClientRect().height.toFixed(1);
    cr.bottom=+(cr.top+cta.getBoundingClientRect().height).toFixed(1);
    out.heroCta=cr;}
  out.heroStruk={exists:!!$('.hero-struk'),box:$('.hero-struk')?rect($('.hero-struk')):null,
    rows:$$('.hs-row').map(function(r){return r.textContent.replace(/\s+/g,' ').trim()})};
  var fn=document.querySelector('.hero .fnote');
  if(fn){var fc=getComputedStyle(fn);out.fnote={text:fn.textContent.trim().slice(0,90),fontSize:fc.fontSize,lineHeight:fc.lineHeight,box:rect(fn)};}

  /* L10/L11 sky */
  out.sky=$$('.hero-sky img').map(function(i){return{cls:i.className,src:(i.currentSrc||i.src).split('/').pop(),
    natural:i.naturalWidth+'x'+i.naturalHeight,rendered:Math.round(i.getBoundingClientRect().width)+'x'+Math.round(i.getBoundingClientRect().height)}});
  var cloud=$('.h-cloud-1');
  out.cloudAnim=cloud?{animation:getComputedStyle(cloud).animationName+' '+getComputedStyle(cloud).animationDuration+' '+getComputedStyle(cloud).animationIterationCount,filter:getComputedStyle(cloud).filter}:null;
  var grid=$('.h-grid');
  out.gridParallax=grid?{hasDataParallax:grid.hasAttribute('data-parallax'),val:grid.getAttribute('data-parallax'),translate:grid.style.translate||'(none)'}:null;

  /* L13 hero visual link */
  var hvl=$('.hero-visual-link');
  if(hvl){var im=hvl.querySelector('img');
    out.heroVisualLink={wrapsImageAndText:!!(im&&hvl.querySelector('figcaption')&&hvl.querySelector('.hint')),
      href:hvl.getAttribute('href'),imgSrc:(im.currentSrc||im.src).split('/').pop(),
      imgNatural:im.naturalWidth+'x'+im.naturalHeight,
      imgRendered:Math.round(im.getBoundingClientRect().width)+'x'+Math.round(im.getBoundingClientRect().height),
      caption:hvl.querySelector('figcaption')?hvl.querySelector('figcaption').textContent.trim():null};}

  /* L14-19 modules */
  var rows=$$('.modrow');
  out.modules={count:rows.length,allAreLinks:rows.every(function(r){return r.tagName==='A'}),
    rows:rows.map(function(r){var c=r.querySelector('.mchip');
      return{no:r.querySelector('.no')?r.querySelector('.no').textContent.trim():null,
        title:r.querySelector('b')?r.querySelector('b').textContent.trim():null,
        chip:c?c.textContent.trim():null,chipLines:c?lines(c):null,
        status:r.querySelector('.mst')?r.querySelector('.mst').textContent.trim():null,
        href:r.getAttribute('href'),height:+r.getBoundingClientRect().height.toFixed(0)}}),
    sudahJalanCount:rows.filter(function(r){var m=r.querySelector('.mst');return m&&/Sudah jalan/.test(m.textContent)}).length,
    pickCountText:$('.pick-count')?$('.pick-count').textContent.trim():null,
    pickCountVisible:$('.pick-count')?$('.pick-count').offsetParent!==null:null,
    totalRowsHeight:rows.reduce(function(s,r){return s+r.getBoundingClientRect().height},0).toFixed(0)};

  /* L20 calculators */
  out.calculators=$$('.trow').map(function(a){return{text:a.textContent.replace(/\s+/g,' ').trim().slice(0,70),
    href:a.getAttribute('href'),height:+a.getBoundingClientRect().height.toFixed(0)}});

  /* L21 section rhythm */
  out.sections=['modul','alat','pajak','harga','testimoni'].map(function(id){
    var el=document.getElementById(id);
    return el?{id:id,bg:getComputedStyle(el).backgroundColor,padTop:getComputedStyle(el).paddingTop,
      padBottom:getComputedStyle(el).paddingBottom,h:+el.getBoundingClientRect().height.toFixed(0)}:{id:id,missing:true}});

  /* L22 pajak order */
  var pj=document.getElementById('pajak');
  if(pj){var cc=pj.querySelector('.calc-card');
    out.pajak={domOrder:$$('.tax-grid2 > div:first-child > *').map(function(e){return e.tagName+' "'+e.textContent.trim().slice(0,40)+'"'}),
      calcTopOffsetInSection:cc?+(cc.getBoundingClientRect().top-pj.getBoundingClientRect().top).toFixed(0):null,
      textColHeight:(function(){var d=pj.querySelector('.tax-grid2 > div');return d?+d.getBoundingClientRect().height.toFixed(0):null})()};}

  /* L23-26 widget */
  var wp=document.getElementById('tax-wp'),om=document.getElementById('tax-omzet');
  out.taxWidget={
    jenisUsaha:wp?{tag:wp.tagName,options:Array.prototype.map.call(wp.options,function(o){return o.text}),
      default:wp.options[wp.selectedIndex]?wp.options[wp.selectedIndex].text:null}:null,
    omzetInput:om?{type:om.type,inputmode:om.getAttribute('inputmode'),valueShown:om.value,
      hasRpPrefixInside:false,quickChipsCount:$$('#pajak .seg label').length,clearBtn:!!$('#pajak [data-clear]')}:null,
    resultAriaLive:document.getElementById('tax-out')?document.getElementById('tax-out').getAttribute('aria-live'):null,
    hitungButtons:$$('.calc-card button').map(function(b){return b.textContent.trim()}).filter(function(t){return/Hitung/i.test(t)}),
    resultShown:document.getElementById('tax-result')?document.getElementById('tax-result').textContent:null,
    resultFontSize:document.getElementById('tax-result')?getComputedStyle(document.getElementById('tax-result')).fontSize:null,
    resultBelowInput:(om&&document.getElementById('tax-out'))?document.getElementById('tax-out').getBoundingClientRect().top>om.getBoundingClientRect().bottom:null,
    resultTopVsInputTop:(om&&document.getElementById('tax-out'))?+(document.getElementById('tax-out').getBoundingClientRect().top-om.getBoundingClientRect().top).toFixed(0):null};

  /* L27-31 pricing */
  var cards=$$('.price-card');
  out.pricing={order:cards.map(function(c){var btn=c.querySelector('a.btn');
    return{name:c.querySelector('.price-name')?c.querySelector('.price-name').textContent.trim():null,
      isActive:c.classList.contains('active'),
      marker:getComputedStyle(c,'::before').content,
      cta:btn?{text:btn.textContent.trim(),href:btn.getAttribute('href')}:null}}),
    stackedMobile:cards.length===2?Math.abs(cards[0].getBoundingClientRect().left-cards[1].getBoundingClientRect().left)<10:null,
    proBullets:cards[1]?Array.prototype.map.call(cards[1].querySelectorAll('.price-list li'),function(li){return li.textContent.trim()}):[],
    priceVal:(function(){if(!cards[1])return null;var v=cards[1].querySelector('.price-val');
      var sp=v.querySelectorAll('span');var rs=Array.prototype.map.call(sp,function(s){return s.getBoundingClientRect()});
      return{text:v.textContent.trim(),fontSize:getComputedStyle(v).fontSize,
        spansSameLine:rs.length>1?Math.abs(rs[0].top-rs[1].top)<5:null}})(),
    waLine:(function(){var h=cards[1]?cards[1].querySelector('.hint'):null;
      return h?{text:h.textContent.trim().slice(0,100),hasButtonInside:!!h.querySelector('a,button')}:null})()};

  /* L32 order + label */
  var pc=$('.price-close .cta-row a'),tst=document.getElementById('testimoni');
  out.sectionOrder={closingCtaTop:pc?+pc.getBoundingClientRect().top.toFixed(0):null,
    testimoniTop:tst?+tst.getBoundingClientRect().top.toFixed(0):null,
    testimoniAfterClosingCta:(pc&&tst)?tst.getBoundingClientRect().top>pc.getBoundingClientRect().top:null,
    contohLabel:$('.tst-label')?$('.tst-label').textContent.trim().slice(0,80):null,
    renderedCards:$$('.tst-card').length};

  /* L33 footer */
  out.footer={columns:$$('.foot-grid > nav').map(function(n){return n.getAttribute('aria-label')}),
    linkHeights:$$('.foot ul a').slice(0,5).map(function(a){return +a.getBoundingClientRect().height.toFixed(1)}),
    linkFontSize:$$('.foot ul a')[0]?getComputedStyle($$('.foot ul a')[0]).fontSize:null,
    ulGap:$$('.foot ul')[0]?getComputedStyle($$('.foot ul')[0]).rowGap:null,
    paraLens:$$('.foot p').map(function(p){return p.textContent.trim().length})};

  /* L34 absence */
  out.absentBlocks={faqCount:$$('.faq-item, details').length,
    idCara:$$('[id*="cara"],[class*="step"]').length,
    idKeamanan:$$('[id*="keamanan"],[class*="security"]').length,
    textFAQ:/\bFAQ\b/.test(document.body.textContent),
    textKeamananData:/Keamanan data/.test(document.body.textContent),
    textCaraMulai:/Cara mulai/.test(document.body.textContent)};

  /* L36 back-to-top */
  out.backToTopCount=$$('a[href="#top"],.to-top,[data-to-top],button[aria-label*="atas"],a[aria-label*="atas"]').length;

  /* L37 skip link */
  var sk=$('.skip');
  if(sk){sk.focus();var sr=sk.getBoundingClientRect();
    out.skipLink={exists:true,href:sk.getAttribute('href'),focusLeft:+sr.left.toFixed(1),
      visibleOnFocus:sr.left===0&&sr.width>0,mainTarget:!!document.getElementById('main')};
    sk.blur();}

  /* L7 logo */
  out.logoHref=$('.nav .logo')?$('.nav .logo').getAttribute('href'):null;

  /* L6 anchor overlap */
  try{
    var hg=document.getElementById('harga');
    window.scrollTo({top:hg.getBoundingClientRect().top+window.scrollY,behavior:'instant'});
    var rt=hg.getBoundingClientRect().top,navH=document.getElementById('nav').getBoundingClientRect().height;
    out.anchorTest={hargaTopAfterJump:+rt.toFixed(1),navHeight:+navH.toFixed(1),coveredByStickyNav:rt<navH};
    window.scrollTo({top:0,behavior:'instant'});
  }catch(e){out.anchorTest={error:String(e)}}

  /* L34 absence — textContent TANPA <script> (hindari false-positive dari sumber probe sendiri) */
  (function(){
    var clone=document.body.cloneNode(true);
    clone.querySelectorAll('script').forEach(function(s){s.remove()});
    var txt=clone.textContent||'';
    function ctx(re){var m=txt.search(re);return m<0?null:txt.slice(Math.max(0,m-40),m+60).replace(/\s+/g,' ')}
    out.absentClean={faqCount:$$('.faq-item, details').length,
      caraMulai:ctx(/Cara mulai/), keamananData:ctx(/Keamanan data/), pwaV24:ctx(/PWA v24/)};
  })();

  /* L5: menu mobile dibuka — tinggi baris + panel */
  try{
    var bg=$('.nav-burger');bg.click();
    var mnav=$('.nav-mobile');
    out.menuOpen={open:mnav.classList.contains('open'),panelH:+mnav.getBoundingClientRect().height.toFixed(0),
      linkHeights:$$('.nav-mobile a').slice(0,4).map(function(a){return +a.getBoundingClientRect().height.toFixed(1)}),
      loginInsideMenu:$$('.nav-mobile a.nav-login').length};
    bg.click();
  }catch(e){out.menuOpen={error:String(e)}}

  /* L13: tinggi testimoni & carousel */
  var tg=$('.tst-grid');
  out.tstGrid=tg?{h:+tg.getBoundingClientRect().height.toFixed(0),overflowX:getComputedStyle(tg).overflowX}:null;

  /* L35: screenfuls */
  out.screenfuls800=+(out.scrollHeight/800).toFixed(2);

  var pre=document.createElement('pre');pre.id='__probe';pre.style.display='none';
  try{
    pre.textContent='PROBE_START'+JSON.stringify(out)+'PROBE_END';
  }catch(e){
    pre.textContent='PROBE_START{"_probeError":"'+String(e&&(e.message||e)).replace(/"/g,'')+'"}PROBE_END';
  }
  document.body.appendChild(pre);
})()
