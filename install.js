// Tombol & petunjuk install. Otomatis sembunyi kalau aplikasi sudah ter-install.
(function(){
  var KEY="chartdesk-install-dismiss";
  var ua=navigator.userAgent||"";
  var standalone=matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;
  if(standalone)return;
  try{var d=+localStorage.getItem(KEY);if(d&&Date.now()-d<3*864e5)return}catch(e){}

  var isIOS=/iPhone|iPad|iPod/.test(ua)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
  var isAndroid=/Android/.test(ua);
  var inApp=/FBAN|FBAV|Instagram|Line\/|WhatsApp|Telegram|TikTok|musical_ly|; wv\)/.test(ua);
  var isSamsung=/SamsungBrowser/.test(ua);
  var isIOSSafari=isIOS&&!/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua)&&!inApp;
  var deferred=null;

  var css=document.createElement("style");
  css.textContent=".inst{background:var(--accent);color:var(--surface);border-radius:14px;padding:14px 16px;display:flex;flex-direction:column;gap:10px}"+
  ".inst-top{display:flex;justify-content:space-between;align-items:start;gap:10px}"+
  ".inst b{font-family:var(--display);font-size:17px;font-weight:600}"+
  ".inst p{margin:0;font-size:14px;line-height:1.45}"+
  ".inst ol{margin:0;padding-left:20px;font-size:14px;display:flex;flex-direction:column;gap:4px}"+
  ".inst .x{background:none;color:inherit;padding:0 4px;font-size:18px;line-height:1;opacity:.8}"+
  ".inst .acts{display:flex;gap:8px;flex-wrap:wrap}"+
  ".inst .btn{background:var(--surface);color:var(--accent);border-radius:10px;padding:10px 14px;font-weight:600;text-decoration:none;border:0;font:inherit;font-weight:600;cursor:pointer}"+
  ".inst .btn.alt{background:transparent;color:var(--surface);border:1px solid currentColor}"+
  ".inst small{opacity:.85;font-size:12px}";
  document.head.appendChild(css);

  var box=document.createElement("section");
  box.className="inst";box.setAttribute("aria-label","Install aplikasi");box.hidden=true;
  var header=document.querySelector(".wrap header")||document.querySelector(".wrap .head");
  header.insertAdjacentElement("afterend",box);

  function show(html){
    box.innerHTML='<div class="inst-top"><div><b>Pasang Chart Desk di HP</b></div><button class="x" type="button" aria-label="Tutup">✕</button></div>'+html;
    box.hidden=false;
    box.querySelector(".x").onclick=function(){box.hidden=true;try{localStorage.setItem(KEY,Date.now())}catch(e){}};
  }
  function copyBtn(){
    var b=box.querySelector("#instCopy");if(!b)return;
    b.onclick=function(){
      var url=location.href.split("#")[0];
      var done=function(){b.textContent="Link tersalin ✓"};
      if(navigator.clipboard)navigator.clipboard.writeText(url).then(done,function(){prompt("Salin link ini:",url)});
      else prompt("Salin link ini:",url);
    };
  }

  // 1) Dibuka dari WhatsApp / Instagram / dll.
  if(inApp){
    if(isAndroid){
      var u=location.href.replace(/^https?:\/\//,"").split("#")[0];
      show('<p>Kamu membuka link ini dari dalam aplikasi lain (mis. WhatsApp), jadi tidak bisa di-install dari sini. Buka di Chrome dulu.</p>'+
        '<div class="acts"><a class="btn" href="intent://'+u+'#Intent;scheme=https;package=com.android.chrome;end">Buka di Chrome</a>'+
        '<button class="btn alt" type="button" id="instCopy">Salin link</button></div>'+
        '<small>Kalau tombol tidak jalan: ketuk ⋮ di pojok kanan atas → "Buka di Chrome" / "Buka di browser".</small>');
    }else{
      show('<p>Kamu membuka link ini dari dalam aplikasi lain. Buka di <b style="font-size:inherit">Safari</b> dulu supaya bisa di-install.</p>'+
        '<div class="acts"><button class="btn" type="button" id="instCopy">Salin link</button></div>'+
        '<small>Lalu buka Safari, tempel link-nya, dan ikuti petunjuk yang muncul.</small>');
    }
    copyBtn();return;
  }

  // 2) iPhone / iPad
  if(isIOS){
    if(isIOSSafari){
      show('<ol><li>Ketuk tombol <b style="font-size:inherit">Share</b> (kotak dengan panah ke atas) di bawah layar.</li>'+
        '<li>Gulir lalu pilih <b style="font-size:inherit">Add to Home Screen</b> / <b style="font-size:inherit">Tambah ke Layar Utama</b>.</li>'+
        '<li>Ketuk <b style="font-size:inherit">Add</b>. Ikon muncul di layar utama.</li></ol>');
    }else{
      show('<p>Di iPhone, aplikasi ini hanya bisa di-install lewat <b style="font-size:inherit">Safari</b>.</p>'+
        '<div class="acts"><button class="btn" type="button" id="instCopy">Salin link</button></div>'+
        '<small>Buka Safari, tempel link-nya, lalu ikuti petunjuknya.</small>');
      copyBtn();
    }
    return;
  }

  // 3) Android Chrome / Edge / dll: pakai tombol install asli kalau tersedia
  function manual(){
    if(deferred)return;
    var steps=isSamsung
      ?'<li>Ketuk menu <b style="font-size:inherit">☰</b> di bawah kanan.</li><li>Pilih <b style="font-size:inherit">Tambahkan halaman ke</b> → <b style="font-size:inherit">Layar Utama</b>.</li>'
      :'<li>Ketuk menu <b style="font-size:inherit">⋮</b> di kanan atas Chrome.</li><li>Pilih <b style="font-size:inherit">Instal aplikasi</b> atau <b style="font-size:inherit">Tambahkan ke layar utama</b>.</li>';
    show('<ol>'+steps+'<li>Ketuk <b style="font-size:inherit">Instal</b> / <b style="font-size:inherit">Tambahkan</b>.</li></ol>'+
      (isAndroid?'<small>Kalau ikon tidak muncul (sering di Xiaomi/Oppo/Vivo), buka Pengaturan → Aplikasi → '+(isSamsung?'Samsung Internet':'Chrome')+' → Izin, aktifkan "Pintasan layar utama", lalu coba lagi.</small>':'')+
      (!isAndroid&&!isSamsung?'<small>Buka link ini di HP Android (Chrome) atau iPhone (Safari) untuk memasang aplikasinya.</small>':''));
  }
  addEventListener("beforeinstallprompt",function(e){
    e.preventDefault();deferred=e;
    show('<p>Pasang aplikasi ini supaya bisa dibuka dari layar utama, layar penuh, dan tetap jalan tanpa internet.</p>'+
      '<div class="acts"><button class="btn" type="button" id="instGo">Install aplikasi</button></div>');
    box.querySelector("#instGo").onclick=function(){
      deferred.prompt();
      deferred.userChoice.then(function(r){if(r.outcome==="accepted")box.hidden=true;deferred=null});
    };
  });
  addEventListener("appinstalled",function(){box.hidden=true});
  setTimeout(manual,3500);
})();
